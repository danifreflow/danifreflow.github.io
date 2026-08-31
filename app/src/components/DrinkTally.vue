<template>
  <section v-if="entries.length" class="drink-tally">
    <h3 class="drink-tally__title caption">Marcador de tragos</h3>
    <ul class="drink-tally__list">
      <li
        v-for="[name, count] in entries"
        :key="name"
        class="drink-tally__item"
        :class="{ 'drink-tally__item--active': name === currentPlayer }"
      >
        <span class="drink-tally__name">{{ name }}</span>
        <span class="drink-tally__count">{{ count }} {{ count === 1 ? 'trago' : 'tragos' }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ drinks: Record<string, number>; currentPlayer: string | null }>()

const entries = computed(() => Object.entries(props.drinks).sort((a, b) => b[1] - a[1]))
</script>

<style scoped>
.drink-tally {
  width: 100%;
  max-width: 360px;
  background: var(--bg-soft);
  border-radius: var(--r-md);
  padding: var(--sp-4) var(--sp-5);
}

.drink-tally__title {
  margin: 0 0 var(--sp-3);
}

.drink-tally__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.drink-tally__item {
  display: flex;
  justify-content: space-between;
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--r-sm);
  background: var(--base-white);
  color: var(--fg);
}

.drink-tally__item--active {
  outline: 2px solid var(--accent);
  color: var(--fg-strong);
}

.drink-tally__name {
  font-weight: 500;
}
</style>
