export type GuessDirection = 'mayor' | 'menor' | 'igual'

export type Outcome =
  | 'inicio'
  | 'acierto'
  | 'sacada'
  | 'fallo'
  | 'humillacion'
  | 'empate'
  | 'igual_acierto'
  | 'igual_fallo'

export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos' | 'joker'

export type GameMode = 'normal' | 'full_nelson'

/** Modo elegido en la pantalla inicial: incluye juegos con motor propio. */
export type AppMode = GameMode | 'carrera_caballos'

export interface Card {
  suit: Suit
  number: number
  label: string
  code: string
}

export interface GameEvent {
  code: string
  title: string
  message: string
  drinks: number
}

export interface RoundResult {
  round_number: number
  player: string | null
  guess: GuessDirection | null
  previous_card: Card | null
  card: Card
  correct: boolean | null
  diff: number | null
  outcome: Outcome
  drinks_applied: number
  drinks_delta: Record<string, number>
  events: GameEvent[]
}

export interface GameState {
  id: string
  mode: GameMode
  players: string[]
  current_player: string | null
  top_card: Card
  cards_remaining: number
  total_cards: number
  finished: boolean
  drinks: Record<string, number>
  last_round: RoundResult
  history: RoundResult[]
}
