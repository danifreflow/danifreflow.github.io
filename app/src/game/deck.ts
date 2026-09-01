/**
 * Primitivas de baraja española compartidas entre los distintos juegos
 * (Mayor o Menor / Full Nelson y la Carrera de Caballos).
 */

import type { Card, Suit } from '@/types/game'

export const SUITS: Suit[] = ['oros', 'copas', 'espadas', 'bastos']

/** Baraja de 40 cartas (1-7, 10-12): la que se usa para jugar al Mayor o Menor. */
export const GAME_NUMBERS: number[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]

/** Baraja completa de 48 cartas (incluye 8 y 9): la usa la Carrera de Caballos. */
export const ALL_NUMBERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const SUIT_LABELS: Record<Suit, string> = {
  oros: 'Oros',
  copas: 'Copas',
  espadas: 'Espadas',
  bastos: 'Bastos',
  joker: 'Popo-popo-per',
}

const NUMBER_LABELS: Record<number, string> = { 1: 'As', 10: 'Sota', 11: 'Caballo', 12: 'Rey' }

export function rankLabel(number: number): string {
  return NUMBER_LABELS[number] ?? String(number)
}

export function suitLabel(suit: Suit): string {
  return SUIT_LABELS[suit]
}

export function makeCard(suit: Suit, number: number): Card {
  return {
    suit,
    number,
    label: `${rankLabel(number)} de ${SUIT_LABELS[suit]}`,
    code: `${number}_${suit}`,
  }
}

export function buildDeck(numbers: number[] = GAME_NUMBERS): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const number of numbers) {
      deck.push(makeCard(suit, number))
    }
  }
  return deck
}

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
