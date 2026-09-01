/**
 * Motor de la "Carrera de Caballos", 100% en el navegador.
 *
 * Reglas:
 * - Se usa la baraja española completa de 48 cartas (incluye 8 y 9): con la
 *   baraja de 40 solo quedan 9 cartas de cada palo tras sacar el caballo, y
 *   la pista sería mucho más difícil de completar. Con 48 quedan 11.
 * - Los 4 caballos (los "11" de cada palo) se sacan de la baraja: son las
 *   fichas de carrera, empiezan en la posición 0 (línea de salida).
 * - Se reparten al azar TRACK_LENGTH cartas más (fuera del resto del mazo)
 *   formando la pista, en fila, boca abajo.
 * - Con las cartas restantes se va sacando una a una: el caballo del mismo
 *   palo que la carta avanza una posición.
 * - Cuando un caballo llega (por primera vez) a una posición de la pista, esa
 *   carta se levanta: el caballo cuyo palo coincida con el de esa carta
 *   retrocede una posición (puede ser el mismo caballo que acaba de avanzar).
 * - Gana el primer caballo que completa la pista (sale de ella). Si se acaban
 *   las cartas antes de eso, gana el caballo más adelantado.
 */

import { ALL_NUMBERS, buildDeck, createId, shuffle, SUITS } from '@/game/deck'
import type { Card, Suit } from '@/types/game'
import type { HorseState, RaceEvent, RaceState, TrackSlot } from '@/types/horseRace'

const HORSE_NUMBER = 11
export const TRACK_LENGTH = 7

export class RaceError extends Error {}

export class HorseRace {
  readonly id: string
  readonly horses: HorseState[]
  readonly track: TrackSlot[]
  readonly totalCards: number
  finished = false
  winner: Suit | null = null
  readonly history: RaceEvent[] = []

  private drawPile: Card[]

  constructor() {
    this.id = createId()

    const fullDeck = buildDeck(ALL_NUMBERS)
    const raceableCards = fullDeck.filter((card) => card.number !== HORSE_NUMBER)
    const shuffled = shuffle(raceableCards)

    const trackCards = shuffled.slice(0, TRACK_LENGTH)
    this.drawPile = shuffled.slice(TRACK_LENGTH)
    this.totalCards = this.drawPile.length

    this.horses = SUITS.map((suit) => ({ suit, position: 0 }))
    this.track = trackCards.map((card, i) => ({ index: i + 1, card, revealed: false }))
  }

  get cardsRemaining(): number {
    return this.drawPile.length
  }

  get lastEvent(): RaceEvent | null {
    return this.history[this.history.length - 1] ?? null
  }

  draw(): RaceEvent {
    if (this.finished) {
      throw new RaceError('La carrera ya ha terminado.')
    }
    if (this.drawPile.length === 0) {
      throw new RaceError('No quedan cartas en la baraja.')
    }

    const card = this.drawPile.shift() as Card
    const horse = this.horses.find((h) => h.suit === card.suit) as HorseState
    horse.position += 1

    let triggeredReveal: TrackSlot | null = null
    let setbackHorse: Suit | null = null

    const slot = this.track.find((s) => s.index === horse.position && !s.revealed)
    if (slot) {
      slot.revealed = true
      triggeredReveal = slot
      const target = this.horses.find((h) => h.suit === slot.card.suit) as HorseState
      target.position = Math.max(0, target.position - 1)
      setbackHorse = target.suit
    }

    const event: RaceEvent = {
      drawnCard: card,
      movedHorse: horse.suit,
      newPosition: horse.position,
      triggeredReveal,
      setbackHorse,
    }
    this.history.push(event)

    if (horse.position >= TRACK_LENGTH) {
      this.finished = true
      this.winner = horse.suit
    } else if (this.drawPile.length === 0) {
      // Sin ganador claro al agotarse el mazo: gana el más adelantado.
      this.finished = true
      this.winner = this.horses.reduce((best, h) => (h.position > best.position ? h : best)).suit
    }

    return event
  }

  toState(): RaceState {
    return {
      horses: this.horses.map((h) => ({ ...h })),
      track: this.track.map((s) => ({ ...s })),
      cardsRemaining: this.cardsRemaining,
      totalCards: this.totalCards,
      finished: this.finished,
      winner: this.winner,
      lastEvent: this.lastEvent,
      history: [...this.history],
    }
  }
}
