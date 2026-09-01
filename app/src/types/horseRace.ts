import type { Card, Suit } from '@/types/game'

export interface HorseState {
  suit: Suit
  /** 0 = línea de salida, 10 = ha completado la pista (ganador). */
  position: number
}

export interface TrackSlot {
  /** Posición en la pista, 1-10. */
  index: number
  card: Card
  revealed: boolean
}

export interface RaceEvent {
  drawnCard: Card
  movedHorse: Suit
  newPosition: number
  triggeredReveal: TrackSlot | null
  setbackHorse: Suit | null
}

export interface RaceState {
  horses: HorseState[]
  track: TrackSlot[]
  cardsRemaining: number
  totalCards: number
  finished: boolean
  winner: Suit | null
  lastEvent: RaceEvent | null
  history: RaceEvent[]
}

export interface PlayerBet {
  player: string
  horse: Suit
  amount: number
}
