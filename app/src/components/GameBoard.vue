<template>
  <div class="game-board">
    <header class="game-board__header">
      <p class="caption" :class="{ 'game-board__mode--full-nelson': state.mode === 'full_nelson' }">
        Modo: {{ state.mode === 'full_nelson' ? 'Full Nelson' : 'Normal' }}
      </p>
      <p class="caption">Quedan {{ state.cards_remaining }} de {{ state.total_cards }} cartas</p>
      <p v-if="state.current_player" class="body-lg">
        Turno de <strong>{{ state.current_player }}</strong>
      </p>
    </header>

    <div class="game-board__table">
      <PlayingCard :card="state.top_card" />
    </div>

    <ResultBanner :round="state.last_round" />

    <div v-if="!state.finished" class="game-board__actions">
      <button class="btn btn--menor" :disabled="loading" @click="emit('guess', 'menor')">Menor</button>
      <button class="btn btn--igual" :disabled="loading" @click="emit('guess', 'igual')">Igual</button>
      <button class="btn btn--mayor" :disabled="loading" @click="emit('guess', 'mayor')">Mayor</button>
    </div>
    <div v-else class="game-board__finished">
      <h2 class="h2">¡Partida terminada!</h2>
      <button class="btn btn--primary" @click="emit('restart')">Jugar otra vez</button>
    </div>

    <p v-if="error" class="game-board__error body-sm">{{ error }}</p>

    <DrinkTally :drinks="state.drinks" :current-player="state.current_player" />
  </div>
</template>

<script setup lang="ts">
import DrinkTally from '@/components/DrinkTally.vue'
import PlayingCard from '@/components/PlayingCard.vue'
import ResultBanner from '@/components/ResultBanner.vue'
import type { GameState, GuessDirection } from '@/types/game'

defineProps<{ state: GameState; loading: boolean; error: string | null }>()
const emit = defineEmits<{
  (e: 'guess', direction: GuessDirection): void
  (e: 'restart'): void
}>()
</script>

<style scoped>
.game-board {
  width: 100%;
  max-width: 480px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-5);
}

.game-board__header {
  text-align: center;
}

.game-board__header p {
  margin: 0;
}

.game-board__mode--full-nelson {
  color: #8e24aa;
}

.game-board__table {
  display: flex;
  justify-content: center;
}

.game-board__actions {
  display: flex;
  gap: var(--sp-4);
  width: 100%;
}

.game-board__actions .btn {
  flex: 1;
  min-width: 0;
}

@media (max-width: 480px) {
  .game-board__actions {
    gap: var(--sp-2);
  }
}

.btn--mayor {
  background: var(--accent);
  color: var(--fg-inverse);
}

.btn--menor {
  background: var(--brand-blue-strong);
  color: var(--fg-inverse);
  box-shadow: var(--shadow-md);
}

.btn--igual {
  background: var(--brand-beige-deep);
  color: var(--fg-inverse);
  box-shadow: var(--shadow-md);
}

.game-board__finished {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
  text-align: center;
}

.game-board__error {
  color: #b23b3b;
  margin: 0;
}
</style>
