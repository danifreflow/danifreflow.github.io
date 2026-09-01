<template>
  <div class="horse-race">
    <header class="horse-race__header">
      <p class="caption">Quedan {{ race.cardsRemaining }} de {{ race.totalCards }} cartas</p>
    </header>

    <div class="race-track">
      <div v-for="slot in race.track" :key="slot.index" class="race-track__slot">
        <img
          :src="slot.revealed ? cardImageUrl(slot.card.code) : cardImageUrl('card_back')"
          :alt="slot.revealed ? slot.card.label : 'Carta oculta'"
        />
        <span class="race-track__slot-index">{{ slot.index }}</span>
      </div>
    </div>

    <div class="race-lanes">
      <div v-for="horse in race.horses" :key="horse.suit" class="race-lane">
        <SuitIcon :suit="horse.suit" :size="18" />
        <div class="race-lane__track">
          <div
            class="race-lane__horse"
            :class="{ 'race-lane__horse--winner': race.winner === horse.suit }"
            :style="{ left: `${(horse.position / 10) * 100}%` }"
          >
            <img :src="cardImageUrl(`11_${horse.suit}`)" :alt="`Caballo de ${suitLabel(horse.suit)}`" />
          </div>
        </div>
        <span class="race-lane__position caption">{{ horse.position }}/10</span>
      </div>
    </div>

    <div v-if="race.lastEvent" class="race-event">
      <p class="body-sm">
        Sale {{ race.lastEvent.drawnCard.label }}: el caballo de {{ suitLabel(race.lastEvent.movedHorse) }} avanza a
        la posición {{ race.lastEvent.newPosition }}.
      </p>
      <p v-if="race.lastEvent.triggeredReveal && race.lastEvent.setbackHorse" class="body-sm race-event__reveal">
        Se descubre {{ race.lastEvent.triggeredReveal.card.label }} en la posición
        {{ race.lastEvent.triggeredReveal.index }}: el caballo de {{ suitLabel(race.lastEvent.setbackHorse) }}
        retrocede a la posición {{ setbackPosition }}.
      </p>
    </div>

    <p v-if="error" class="horse-race__error body-sm">{{ error }}</p>

    <button v-if="!race.finished" type="button" class="btn btn--primary horse-race__draw" @click="emit('draw')">
      Sacar carta
    </button>

    <div v-else class="race-results">
      <h2 class="h2">¡Gana el caballo de {{ suitLabel(race.winner!) }}!</h2>

      <ul class="race-results__list">
        <li
          v-for="bet in bets"
          :key="bet.player"
          class="race-results__item"
          :class="{ 'race-results__item--win': bet.horse === race.winner }"
        >
          <span>{{ bet.player }} ({{ suitLabel(bet.horse) }})</span>
          <span v-if="bet.horse === race.winner">Gana: reparte {{ bet.amount }} {{ trago(bet.amount) }}</span>
          <span v-else>Bebe {{ bet.amount }} {{ trago(bet.amount) }}</span>
        </li>
      </ul>

      <div v-if="pendingWinners.length" class="race-distribute">
        <div v-for="winner in pendingWinners" :key="winner.player" class="race-distribute__row">
          <span class="body-sm">{{ winner.player }} reparte {{ winner.amount }} {{ trago(winner.amount) }} a</span>
          <select v-model="targets[winner.player]" class="race-distribute__select">
            <option v-for="p in otherPlayers(winner.player)" :key="p" :value="p">{{ p }}</option>
          </select>
          <button type="button" class="btn btn--secondary" @click="handleDistribute(winner)">Repartir</button>
        </div>
      </div>

      <DrinkTally :drinks="drinks" :current-player="null" />

      <button type="button" class="btn btn--primary" @click="emit('restart')">Jugar otra vez</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

import DrinkTally from '@/components/DrinkTally.vue'
import SuitIcon from '@/components/SuitIcon.vue'
import { cardImageUrl } from '@/game/cardImages'
import { suitLabel } from '@/game/deck'
import type { PlayerBet, RaceState } from '@/types/horseRace'

const props = defineProps<{
  race: RaceState
  bets: PlayerBet[]
  drinks: Record<string, number>
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'draw'): void
  (e: 'distribute', toPlayer: string, amount: number): void
  (e: 'restart'): void
}>()

const setbackPosition = computed(() => {
  const suit = props.race.lastEvent?.setbackHorse
  if (!suit) return 0
  return props.race.horses.find((h) => h.suit === suit)?.position ?? 0
})

const winners = computed(() => props.bets.filter((b) => b.horse === props.race.winner))
const distributed = reactive(new Set<string>())
const targets = reactive<Record<string, string>>({})

const pendingWinners = computed(() => winners.value.filter((w) => !distributed.has(w.player)))

function otherPlayers(player: string): string[] {
  return props.bets.filter((b) => b.player !== player).map((b) => b.player)
}

function trago(amount: number): string {
  return amount === 1 ? 'trago' : 'tragos'
}

function handleDistribute(winner: PlayerBet): void {
  const target = targets[winner.player] ?? otherPlayers(winner.player)[0]
  if (!target) return
  emit('distribute', target, winner.amount)
  distributed.add(winner.player)
}
</script>

<style scoped>
.horse-race {
  width: 100%;
  max-width: 560px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
}

.horse-race__header p {
  margin: 0;
}

.race-track {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: var(--sp-3);
}

.race-track__slot {
  position: relative;
  flex: 0 1 40px;
  min-width: 28px;
  max-width: 40px;
}

.race-track__slot img {
  width: 100%;
  display: block;
  border-radius: 6px;
  box-shadow: var(--shadow-sm);
}

.race-track__slot-index {
  position: absolute;
  bottom: -16px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
  color: var(--fg-muted);
}

.race-lanes {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
}

.race-lane {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.race-lane__track {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 28px;
  background: var(--bg-soft);
  border-radius: var(--r-pill);
}

.race-lane__horse {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--surface);
  box-shadow: var(--shadow-sm);
  transition: left 300ms var(--ease-standard);
}

.race-lane__horse img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.race-lane__horse--winner {
  border-color: var(--accent);
}

.race-lane__position {
  width: 34px;
  text-align: right;
}

.race-event {
  width: 100%;
  background: var(--bg-soft);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  text-align: center;
}

.race-event p {
  margin: 0;
}

.race-event__reveal {
  margin-top: var(--sp-1) !important;
  color: var(--fg-muted);
}

.horse-race__error {
  color: #b23b3b;
  margin: 0;
}

.horse-race__draw {
  width: 100%;
}

.race-results {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
}

.race-results__list {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.race-results__item {
  display: flex;
  justify-content: space-between;
  background: var(--surface);
  border-radius: var(--r-sm);
  padding: var(--sp-2) var(--sp-3);
  color: var(--fg);
}

.race-results__item--win {
  outline: 2px solid var(--accent);
  color: var(--fg-strong);
}

.race-distribute {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.race-distribute__row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
  justify-content: center;
}

.race-distribute__select {
  padding: var(--sp-1) var(--sp-2);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--fg-strong);
}
</style>
