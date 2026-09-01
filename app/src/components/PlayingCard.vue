<template>
  <div class="playing-card" :class="`playing-card--${card.suit}`">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="card.label"
      class="playing-card__image"
      draggable="false"
    />
    <template v-else>
      <span class="playing-card__corner playing-card__corner--tl">{{ cornerLabel }}</span>
      <SuitIcon :suit="card.suit" :size="18" class="playing-card__corner-icon playing-card__corner-icon--tl" />

      <div class="playing-card__center">
        <SuitIcon :suit="card.suit" :size="64" />
      </div>

      <span class="playing-card__corner playing-card__corner--br">{{ cornerLabel }}</span>
      <SuitIcon :suit="card.suit" :size="18" class="playing-card__corner-icon playing-card__corner-icon--br" />

      <p class="playing-card__name">{{ suitLabel(card.suit) }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import SuitIcon from '@/components/SuitIcon.vue'
import { cardImageUrl } from '@/game/cardImages'
import type { Card } from '@/types/game'
import { rankLabel, suitLabel } from '@/utils/cards'

const props = defineProps<{ card: Card }>()

// Todas las cartas de la baraja (1-40) tienen imagen real; el comodín
// "Popo-popo-per" no existe en la baraja española, así que sigue dibujándose.
const imageUrl = computed(() => cardImageUrl(props.card.code))
const cornerLabel = computed(() => (props.card.suit === 'joker' ? '★' : rankLabel(props.card.number)))
</script>

<style scoped>
.playing-card {
  position: relative;
  width: 190px;
  /* Proporción real de los recortes de la baraja (208x319 px). */
  aspect-ratio: 208 / 319;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--base-white);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playing-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
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
  /* Fijo (no usa var(--fg-muted)): la cara de la carta es siempre blanca,
     tanto en modo claro como oscuro, así que su texto no debe cambiar con el tema. */
  color: #4b5563;
}

/* Solo aplica al comodín: es la única carta sin imagen real, así que sigue
   dibujándose con SVG y necesita su propio color de acento. */
.playing-card--joker {
  color: #8e24aa;
}
</style>
