<template>
  <div v-if="visible" class="result-banner" :class="`result-banner--${tone}`">
    <p class="result-banner__title h3">{{ title }}</p>
    <p v-if="message" class="result-banner__message body-sm">{{ message }}</p>

    <ul v-if="round.events.length" class="result-banner__events">
      <li v-for="event in round.events" :key="event.code" class="result-banner__event">
        <span class="result-banner__event-title">{{ event.title }}</span>
        <span class="result-banner__event-message">{{ event.message }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Outcome, RoundResult } from '@/types/game'

const props = defineProps<{ round: RoundResult }>()

type Tone = 'good' | 'bad' | 'neutral'

const OUTCOME_TITLES: Record<Outcome, string> = {
  inicio: 'Carta inicial',
  acierto: '¡Acierto!',
  sacada: '¡Sacada!',
  fallo: 'Fallo',
  humillacion: '¡Humillación!',
  empate: 'Empate',
}

const OUTCOME_TONES: Record<Outcome, Tone> = {
  inicio: 'neutral',
  acierto: 'good',
  sacada: 'good',
  fallo: 'bad',
  humillacion: 'bad',
  empate: 'bad',
}

const visible = computed(() => props.round.outcome !== 'inicio' || props.round.events.length > 0)

const tone = computed(() => OUTCOME_TONES[props.round.outcome])

const title = computed(() => OUTCOME_TITLES[props.round.outcome])

const message = computed(() => {
  const round = props.round
  if (round.outcome === 'inicio') {
    return `Se abre la partida con ${round.card.label}.`
  }

  const who = round.player ? `${round.player} apostó` : 'Se apostó'
  const guessLabel = round.guess === 'mayor' ? 'MAYOR' : 'menor'
  const previousLabel = round.previous_card?.label ?? ''
  const recipients = Object.entries(round.drinks_delta)
  const drinksLabel = recipients.length
    ? recipients
        .map(([name, amount]) => `${name} bebe ${amount} ${amount === 1 ? 'trago' : 'tragos'}`)
        .join(', ') + '.'
    : 'Nadie bebe.'

  return `${who} a ${guessLabel} sobre ${previousLabel}. Sale ${round.card.label}. ${drinksLabel}`
})
</script>

<style scoped>
.result-banner {
  width: 100%;
  max-width: 420px;
  border-radius: var(--r-md);
  padding: var(--sp-4) var(--sp-5);
  text-align: center;
  border: 1px solid var(--border);
}

.result-banner__title {
  margin: 0 0 var(--sp-1);
}

.result-banner__message {
  margin: 0;
  color: var(--fg-muted);
}

.result-banner__events {
  list-style: none;
  margin: var(--sp-3) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.result-banner__event {
  background: var(--accent-soft);
  border-radius: var(--r-sm);
  padding: var(--sp-2) var(--sp-3);
  text-align: left;
}

.result-banner__event-title {
  display: block;
  font-family: var(--font-display);
  letter-spacing: var(--tracking-display);
  color: var(--fg-strong);
}

.result-banner__event-message {
  display: block;
  font-size: var(--fs-body-sm);
  color: var(--fg-muted);
}

.result-banner--good {
  background: #eaf6ec;
  border-color: #bfe3c4;
}
.result-banner--bad {
  background: #fbeaea;
  border-color: #f0c4c4;
}
.result-banner--neutral {
  background: var(--bg-soft);
}
</style>
