<template>
  <main class="app-shell">
    <PlayerSetup v-if="!state" :loading="loading" :error="error" @start="handleStart" />
    <GameBoard v-else :state="state" :loading="loading" :error="error" @guess="handleGuess" @restart="resetGame" />
    <FullNelsonPlayer v-if="state && state.mode === 'full_nelson'" :key="state.id" />
  </main>
</template>

<script setup lang="ts">
import FullNelsonPlayer from '@/components/FullNelsonPlayer.vue'
import GameBoard from '@/components/GameBoard.vue'
import PlayerSetup from '@/components/PlayerSetup.vue'
import { useGame } from '@/composables/useGame'
import type { GameMode, GuessDirection } from '@/types/game'

const { state, loading, error, startGame, guess, resetGame } = useGame()

async function handleStart(players: string[], mode: GameMode): Promise<void> {
  try {
    await startGame(players, mode)
  } catch {
    // el error ya queda reflejado en el estado del composable
  }
}

async function handleGuess(direction: GuessDirection): Promise<void> {
  try {
    await guess(direction)
  } catch {
    // el error ya queda reflejado en el estado del composable
  }
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-6);
  background: linear-gradient(160deg, var(--bg-soft), var(--bg));
}
</style>
