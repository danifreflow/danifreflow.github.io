import type { Suit } from '@/types/game'

const NUMBER_LABELS: Record<number, string> = { 1: 'As', 10: 'Sota', 11: 'Caballo', 12: 'Rey' }

export function rankLabel(number: number): string {
  return NUMBER_LABELS[number] ?? String(number)
}

export const SUIT_LABELS: Record<Suit, string> = {
  oros: 'Oros',
  copas: 'Copas',
  espadas: 'Espadas',
  bastos: 'Bastos',
  joker: 'Popo-popo-per',
}

export function suitLabel(suit: Suit): string {
  return SUIT_LABELS[suit]
}
