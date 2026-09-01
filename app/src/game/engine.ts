/**
 * Motor del juego "Mayor o Menor" con baraja española, 100% en el navegador.
 *
 * Puerto fiel de la lógica de dominio que antes vivía en el backend de FastAPI
 * (game_logic.py), para poder jugar sin servidor en un despliegue estático
 * (GitHub Pages). Las reglas son idénticas:
 *
 * - 40 cartas (4 palos x 10 valores: 1-7, 10-12), se reparten todas sin repetirse.
 * - En cada ronda se apuesta si la siguiente carta será mayor, menor o igual
 *   que la carta superior actual. Acertar salva, fallar bebe 1 trago.
 * - Si la diferencia entre ambas cartas es de 1 (p.ej. sale un 7 con un 6
 *   encima): acertar es una "sacada" (no bebes, reparte 1 trago a cada uno de
 *   los demás jugadores); fallar es una "humillación" (bebes 3 tragos).
 * - Empate (mismo número, distinto palo) apostando mayor/menor: siempre se
 *   beben 2 tragos.
 * - Apuesta "igual": si aciertas (la carta repite número), no bebes y
 *   repartes 4 tragos a cada uno de los demás jugadores; si fallas, bebes 2.
 * - Cartas evento: los 4 ases (bastada, copazo, sablada, lingotazo) y el 3 de
 *   copas (tres copas) fijan sus propios tragos y anulan cualquier otro
 *   cálculo de la ronda.
 *
 * Modo "Full Nelson": mismas reglas, pero todas las cantidades de tragos se
 * multiplican x2, y la baraja incluye una carta comodín extra ("Popo-popo-per")
 * que funciona como una carta evento más.
 */

import { buildDeck as buildStandardDeck, createId, shuffle } from '@/game/deck'
import type { Card, GameEvent, GameMode, GameState, GuessDirection, Outcome, RoundResult } from '@/types/game'

// Hueco sin usar en la numeración real de la baraja (1-7, 10-12): perfecto
// para que el comodín compare de forma natural sin colisionar con ninguna carta.
const JOKER_NUMBER = 8
const JOKER_LABEL = 'Popo-popo-per'

function makeJokerCard(): Card {
  return {
    suit: 'joker',
    number: JOKER_NUMBER,
    label: JOKER_LABEL,
    code: `${JOKER_NUMBER}_joker`,
  }
}

function buildDeck(mode: GameMode): Card[] {
  const deck = buildStandardDeck()
  if (mode === 'full_nelson') {
    deck.push(makeJokerCard())
  }
  return deck
}

// Valores del modo normal. En modo "full_nelson" se multiplican x2 (ver
// Game.drinkMultiplier), incluidos los tragos de las cartas evento.
const FALLO_DRINKS = 1
const HUMILLACION_DRINKS = 3
const EMPATE_DRINKS = 2
const SACADA_DRINKS_PER_OTHER_PLAYER = 1
const IGUAL_FALLO_DRINKS = 2
const IGUAL_ACIERTO_DRINKS_PER_OTHER_PLAYER = 4
const EVENT_DRINKS = 1
const JOKER_DRINKS = 5

const FULL_NELSON_MULTIPLIER = 2

type SimpleOutcome = 'acierto' | 'fallo' | 'humillacion' | 'empate'

// "sacada" no aparece aquí: su coste depende del número de jugadores.
const BASE_DRINKS: Record<SimpleOutcome, number> = {
  acierto: 0,
  fallo: FALLO_DRINKS,
  humillacion: HUMILLACION_DRINKS,
  empate: EMPATE_DRINKS,
}

interface EventDef {
  code: string
  title: string
  message: string
  drinks: number
}

// Estas cartas fijan sus propios tragos: anulan el resultado de la apuesta
// de la ronda, no se suma nada más encima.
const EVENT_CARDS: Record<string, EventDef> = {
  '1_bastos': {
    code: 'bastada',
    title: '¡Bastada!',
    message: '¡Una bastada!',
    drinks: EVENT_DRINKS,
  },
  '1_copas': {
    code: 'copazo',
    title: '¡Copazo!',
    message: '¡Un copazo!',
    drinks: EVENT_DRINKS,
  },
  '1_espadas': {
    code: 'sablada',
    title: '¡Sablada!',
    message: '¡Pega una sablada a tu compañero!',
    drinks: EVENT_DRINKS,
  },
  '1_oros': {
    code: 'lingotazo',
    title: '¡Lingotazo!',
    message: '¡Un lingotazo!',
    drinks: EVENT_DRINKS,
  },
  '3_copas': {
    code: 'tres_copas',
    title: '¡Tres copas!',
    message: '¡Tres de copas, tres copas!',
    drinks: 3,
  },
  [`${JOKER_NUMBER}_joker`]: {
    code: 'popo_popo_per',
    title: '¡Popo-popo-per!',
    message: '¡Popo-popo-per!',
    drinks: JOKER_DRINKS,
  },
}

function checkEvents(card: Card): GameEvent[] {
  const event = EVENT_CARDS[card.code]
  return event ? [{ code: event.code, title: event.title, message: event.message, drinks: event.drinks }] : []
}

export class GameError extends Error {}

export class Game {
  readonly id: string
  readonly mode: GameMode
  readonly players: string[]
  readonly drinks: Record<string, number>
  readonly totalCards: number
  finished = false
  readonly history: RoundResult[] = []
  topCard: Card

  private readonly drinkMultiplier: number
  private drawPile: Card[]
  private currentPlayerIndex = 0

  constructor(players: string[] = [], mode: GameMode = 'normal') {
    this.id = createId()
    this.mode = mode
    this.drinkMultiplier = mode === 'full_nelson' ? FULL_NELSON_MULTIPLIER : 1
    this.players = [...players]
    this.drinks = Object.fromEntries(this.players.map((name) => [name, 0]))

    this.drawPile = shuffle(buildDeck(mode))
    this.totalCards = this.drawPile.length
    const firstCard = this.drawPile.shift() as Card
    this.topCard = firstCard

    this.history.push({
      round_number: 0,
      player: null,
      guess: null,
      previous_card: null,
      card: firstCard,
      correct: null,
      diff: null,
      outcome: 'inicio',
      drinks_applied: 0,
      drinks_delta: {},
      events: checkEvents(firstCard),
    })
  }

  get cardsRemaining(): number {
    return this.drawPile.length
  }

  get currentPlayer(): string | null {
    if (this.players.length === 0) return null
    return this.players[this.currentPlayerIndex]
  }

  get lastRound(): RoundResult {
    return this.history[this.history.length - 1]
  }

  guess(direction: GuessDirection): RoundResult {
    if (this.finished) {
      throw new GameError('La partida ya ha terminado.')
    }
    if (this.drawPile.length === 0) {
      throw new GameError('No quedan cartas en la baraja.')
    }

    const previousCard = this.topCard
    const card = this.drawPile.shift() as Card
    const diff = Math.abs(card.number - previousCard.number)

    let outcome: Outcome
    let correct: boolean | null

    if (direction === 'igual') {
      correct = card.number === previousCard.number
      outcome = correct ? 'igual_acierto' : 'igual_fallo'
    } else if (card.number === previousCard.number) {
      outcome = 'empate'
      correct = false
    } else {
      const isHigher = card.number > previousCard.number
      correct = (direction === 'mayor' && isHigher) || (direction === 'menor' && !isHigher)
      if (correct) {
        outcome = diff === 1 ? 'sacada' : 'acierto'
      } else {
        outcome = diff === 1 ? 'humillacion' : 'fallo'
      }
    }

    const events = checkEvents(card)
    const player = this.currentPlayer
    const drinksDelta: Record<string, number> = {}
    let drinksApplied: number

    if (events.length > 0) {
      // Las cartas evento fijan sus propios tragos y anulan el resultado
      // de la apuesta de esta ronda (no se suma nada más).
      drinksApplied = events.reduce((total, event) => total + event.drinks, 0) * this.drinkMultiplier
      if (player !== null && drinksApplied) {
        drinksDelta[player] = drinksApplied
      }
    } else if (outcome === 'sacada') {
      // Reparte un trago (x2 en Full Nelson) a cada uno de los demás (0 si no hay otros).
      const perPlayer = SACADA_DRINKS_PER_OTHER_PLAYER * this.drinkMultiplier
      drinksApplied = perPlayer * Math.max(this.players.length - 1, 0)
      if (player !== null) {
        for (const other of this.players) {
          if (other !== player) {
            drinksDelta[other] = perPlayer
          }
        }
      }
    } else if (outcome === 'igual_acierto') {
      // Aciertas el "igual": no bebes, repartes N tragos a cada uno de los demás.
      const perPlayer = IGUAL_ACIERTO_DRINKS_PER_OTHER_PLAYER * this.drinkMultiplier
      drinksApplied = perPlayer * Math.max(this.players.length - 1, 0)
      if (player !== null) {
        for (const other of this.players) {
          if (other !== player) {
            drinksDelta[other] = perPlayer
          }
        }
      }
    } else if (outcome === 'igual_fallo') {
      drinksApplied = IGUAL_FALLO_DRINKS * this.drinkMultiplier
      if (player !== null) {
        drinksDelta[player] = drinksApplied
      }
    } else {
      drinksApplied = BASE_DRINKS[outcome as SimpleOutcome] * this.drinkMultiplier
      if (player !== null && drinksApplied) {
        drinksDelta[player] = drinksApplied
      }
    }

    for (const [name, amount] of Object.entries(drinksDelta)) {
      this.drinks[name] = (this.drinks[name] ?? 0) + amount
    }

    const result: RoundResult = {
      round_number: this.history.length,
      player,
      guess: direction,
      previous_card: previousCard,
      card,
      correct,
      diff,
      outcome,
      drinks_applied: drinksApplied,
      drinks_delta: drinksDelta,
      events,
    }

    this.history.push(result)
    this.topCard = card

    if (this.players.length > 0) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    }

    if (this.drawPile.length === 0) {
      this.finished = true
    }

    return result
  }

  toState(): GameState {
    return {
      id: this.id,
      mode: this.mode,
      players: this.players,
      current_player: this.currentPlayer,
      top_card: this.topCard,
      cards_remaining: this.cardsRemaining,
      total_cards: this.totalCards,
      finished: this.finished,
      drinks: { ...this.drinks },
      last_round: this.lastRound,
      history: this.history,
    }
  }
}
