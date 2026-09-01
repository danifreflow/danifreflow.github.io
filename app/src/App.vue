<template>
  <main class="app-shell">
    <ThemeToggle />
    <PlayerSetup v-if="!state" :loading="loading" :error="error" @start="handleStart" />
    <GameBoard v-else :state="state" :loading="loading" :error="error" @guess="handleGuess" @restart="resetGame" />
    <FullNelsonPlayer v-if="state && state.mode === 'full_nelson'" :key="state.id" />
    <footer class="app-credits">
      Cartas:
      <a
        href="https://commons.wikimedia.org/wiki/File:Baraja_espa%C3%B1ola_completa.png"
        target="_blank"
        rel="noopener noreferrer"
      >
        Basquetteur
      </a>
      (<a href="https://creativecommons.org/licenses/by-sa/3.0/deed.es" target="_blank" rel="noopener noreferrer"
        >CC BY-SA 3.0</a
      >), recortadas
    </footer>
  </main>
</template>

<script setup lang="ts">
import FullNelsonPlayer from '@/components/FullNelsonPlayer.vue'
import GameBoard from '@/components/GameBoard.vue'
import PlayerSetup from '@/components/PlayerSetup.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-5);
  padding: var(--sp-6);
  background: linear-gradient(160deg, var(--bg-soft), var(--bg));
}

.app-credits {
  font-size: 11px;
  color: var(--fg-muted);
  opacity: 0.75;
  text-align: center;
}

.app-credits a {
  color: inherit;
  border-bottom-color: currentColor;
}

@media (max-width: 480px) {
  .app-shell {
    padding: var(--sp-4) var(--sp-3);
  }
}
</style>
