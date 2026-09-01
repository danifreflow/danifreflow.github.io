<template>
  <div class="horse-betting">
    <h1 class="h1">Carrera de caballos</h1>
    <p class="body-lg horse-betting__subtitle">Cada jugador apuesta unos tragos a un caballo</p>

    <div class="horse-betting__list">
      <div v-for="row in rows" :key="row.player" class="horse-betting__row">
        <p class="horse-betting__name">{{ row.player }}</p>

        <div class="horse-betting__horses" role="radiogroup" :aria-label="`Caballo de ${row.player}`">
          <button
            v-for="suit in suits"
            :key="suit"
            type="button"
            class="horse-pick"
            :class="[`horse-pick--${suit}`, { 'horse-pick--active': row.horse === suit }]"
            :aria-pressed="row.horse === suit"
            @click="row.horse = suit"
          >
            <SuitIcon :suit="suit" :size="20" />
          </button>
        </div>

        <label class="horse-betting__amount">
          <span class="caption">Tragos</span>
          <input v-model.number="row.amount" type="number" min="1" step="1" />
        </label>
      </div>
    </div>

    <button type="button" class="btn btn--primary horse-betting__start" @click="handleConfirm">
      Soltar los caballos
    </button>
    <button type="button" class="horse-betting__back" @click="emit('cancel')">‹ Volver</button>

    <p v-if="validationError" class="horse-betting__error body-sm">{{ validationError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import SuitIcon from '@/components/SuitIcon.vue'
import type { Suit } from '@/types/game'
import type { PlayerBet } from '@/types/horseRace'

const props = defineProps<{ players: string[] }>()
const emit = defineEmits<{ (e: 'confirm', bets: PlayerBet[]): void; (e: 'cancel'): void }>()

const suits: Suit[] = ['oros', 'copas', 'espadas', 'bastos']

const rows = ref(
  props.players.map((player, index) => ({
    player,
    horse: suits[index % suits.length],
    amount: 1,
  })),
)

const validationError = ref<string | null>(null)

function handleConfirm(): void {
  for (const row of rows.value) {
    if (!row.amount || row.amount < 1) {
      validationError.value = `${row.player} tiene que apostar al menos 1 trago.`
      return
    }
  }
  validationError.value = null
  const bets: PlayerBet[] = rows.value.map((row) => ({
    player: row.player,
    horse: row.horse,
    amount: Math.round(row.amount),
  }))
  emit('confirm', bets)
}
</script>

<style scoped>
.horse-betting {
  width: 100%;
  max-width: 480px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
}

.horse-betting__subtitle {
  margin: 0;
  color: var(--fg-muted);
}

.horse-betting__list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.horse-betting__row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  background: var(--bg-soft);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  text-align: left;
}

.horse-betting__name {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  color: var(--fg-strong);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.horse-betting__horses {
  display: flex;
  gap: var(--sp-1);
}

.horse-pick {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.horse-pick--oros {
  color: var(--brand-orange-deep);
}
.horse-pick--copas {
  color: #b23b3b;
}
.horse-pick--espadas {
  color: var(--brand-blue-strong);
}
.horse-pick--bastos {
  color: #2e7d32;
}

.horse-pick--active {
  border-color: currentColor;
  box-shadow: var(--shadow-sm);
}

.horse-betting__amount {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.horse-betting__amount input {
  width: 56px;
  padding: var(--sp-1) var(--sp-2);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--fg-strong);
  font-size: var(--fs-body);
}

.horse-betting__start {
  width: 100%;
}

.horse-betting__back {
  border: none;
  background: transparent;
  color: var(--fg-muted);
  font-size: var(--fs-body-sm);
  padding: var(--sp-1);
}

.horse-betting__error {
  color: #b23b3b;
  margin: 0;
}

@media (max-width: 480px) {
  .horse-betting__row {
    flex-wrap: wrap;
  }
}
</style>
