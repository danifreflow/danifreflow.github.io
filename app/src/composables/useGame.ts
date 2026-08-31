import { computed, ref } from 'vue'

import { Game, GameError } from '@/game/engine'
import type { GameMode, GameState, GuessDirection } from '@/types/game'

export function useGame() {
  const state = ref<GameState | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let game: Game | null = null

  const lastRound = computed(() => state.value?.last_round ?? null)
  const isFinished = computed(() => state.value?.finished ?? false)

  async function startGame(players: string[], mode: GameMode = 'normal'): Promise<void> {
    error.value = null
    try {
      game = new Game(players, mode)
      state.value = game.toState()
    } catch (err) {
      error.value = err instanceof GameError ? err.message : 'No se pudo crear la partida.'
      throw err
    }
  }

  async function guess(direction: GuessDirection): Promise<void> {
    if (!game || game.finished) return
    error.value = null
    try {
      game.guess(direction)
      state.value = game.toState()
    } catch (err) {
      error.value = err instanceof GameError ? err.message : 'No se pudo registrar la apuesta.'
      throw err
    }
  }

  function resetGame(): void {
    game = null
    state.value = null
    error.value = null
  }

  return { state, loading, error, lastRound, isFinished, startGame, guess, resetGame }
}
