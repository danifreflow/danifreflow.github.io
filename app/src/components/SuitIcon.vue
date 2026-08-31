<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" class="suit-icon" :class="`suit-icon--${suit}`" aria-hidden="true">
    <template v-if="suit === 'oros'">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5" />
    </template>
    <template v-else-if="suit === 'copas'">
      <path
        d="M6 3h12l-1.1 7.2a4.9 4.9 0 0 1-4.9 4.1v2.2h3v2H9v-2h3v-2.2a4.9 4.9 0 0 1-4.9-4.1L6 3Z"
        fill="currentColor"
      />
    </template>
    <template v-else-if="suit === 'espadas'">
      <path d="M12 2 13.3 3.3 12 10 10.7 3.3 12 2Z" fill="currentColor" />
      <rect x="11.2" y="10" width="1.6" height="8" fill="currentColor" />
      <rect x="8" y="10.4" width="8" height="1.6" rx="0.8" fill="currentColor" />
      <path d="M12 18.4 13.6 21H10.4L12 18.4Z" fill="currentColor" />
    </template>
    <template v-else>
      <rect x="10.6" y="2" width="2.8" height="20" rx="1.4" fill="currentColor" transform="rotate(20 12 12)" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { Suit } from '@/types/game'

withDefaults(defineProps<{ suit: Suit; size?: number }>(), { size: 28 })
</script>

<style scoped>
.suit-icon {
  display: inline-block;
}
.suit-icon--oros {
  color: var(--brand-orange-deep);
}
.suit-icon--copas {
  color: #b23b3b;
}
.suit-icon--espadas {
  color: var(--brand-blue-strong);
}
.suit-icon--bastos {
  color: #2e7d32;
}
</style>
