<template>
  <div class="playing-card" :class="`playing-card--${card.suit}`">
    <span class="playing-card__corner playing-card__corner--tl">{{ rankLabel(card.number) }}</span>
    <SuitIcon :suit="card.suit" :size="18" class="playing-card__corner-icon playing-card__corner-icon--tl" />

    <div class="playing-card__center">
      <SuitIcon :suit="card.suit" :size="64" />
    </div>

    <span class="playing-card__corner playing-card__corner--br">{{ rankLabel(card.number) }}</span>
    <SuitIcon :suit="card.suit" :size="18" class="playing-card__corner-icon playing-card__corner-icon--br" />

    <p class="playing-card__name">{{ suitLabel(card.suit) }}</p>
  </div>
</template>

<script setup lang="ts">
import SuitIcon from '@/components/SuitIcon.vue'
import type { Card } from '@/types/game'
import { rankLabel, suitLabel } from '@/utils/cards'

defineProps<{ card: Card }>()
</script>

<style scoped>
.playing-card {
  position: relative;
  width: 180px;
  height: 260px;
  border-radius: var(--r-lg);
  background: var(--base-white);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playing-card__corner {
  position: absolute;
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1;
  letter-spacing: var(--tracking-display);
  color: inherit;
}
.playing-card__corner--tl {
  top: 14px;
  left: 16px;
}
.playing-card__corner--br {
  bottom: 30px;
  right: 16px;
  transform: rotate(180deg);
}

.playing-card__corner-icon {
  position: absolute;
}
.playing-card__corner-icon--tl {
  top: 42px;
  left: 17px;
}
.playing-card__corner-icon--br {
  bottom: 56px;
  right: 17px;
  transform: rotate(180deg);
}

.playing-card__center {
  color: inherit;
}

.playing-card__name {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  font-family: var(--font-sans);
  font-size: var(--fs-caption);
  letter-spacing: var(--tracking-caption);
  text-transform: uppercase;
  color: var(--fg-muted);
}

.playing-card--oros {
  color: var(--brand-orange-deep);
}
.playing-card--copas {
  color: #b23b3b;
}
.playing-card--espadas {
  color: var(--brand-blue-strong);
}
.playing-card--bastos {
  color: #2e7d32;
}
</style>
