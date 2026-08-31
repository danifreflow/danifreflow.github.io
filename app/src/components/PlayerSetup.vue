<template>
  <div class="player-setup">
    <h1 class="display-lg">Mayor o Menor</h1>
    <p class="body-lg player-setup__subtitle">El juego de beber con la baraja española</p>

    <form class="player-setup__form" @submit.prevent="handleSubmit">
      <label class="caption" for="player-name">Jugadores (opcional)</label>
      <div class="player-setup__input-row">
        <input
          id="player-name"
          v-model="draftName"
          class="player-setup__input"
          type="text"
          placeholder="Nombre del jugador"
          @keydown.enter.prevent="addPlayer"
        />
        <button type="button" class="btn btn--secondary" @click="addPlayer">Añadir</button>
      </div>

      <ul v-if="players.length" class="player-setup__list">
        <li v-for="(name, index) in players" :key="`${name}-${index}`" class="player-setup__chip">
          {{ name }}
          <button
            type="button"
            class="player-setup__remove"
            aria-label="Quitar jugador"
            @click="removePlayer(index)"
          >
            ×
          </button>
        </li>
      </ul>

      <button type="submit" class="btn btn--primary player-setup__start" :disabled="loading">
        {{ loading ? 'Barajando…' : 'Empezar partida' }}
      </button>
      <p v-if="error" class="player-setup__error body-sm">{{ error }}</p>
    </form>

    <section class="player-setup__rules">
      <h2 class="h3">Cómo se juega</h2>
      <ul class="body-sm">
        <li>Se reparten las 40 cartas de la baraja, una a una, sin repetirse.</li>
        <li>En cada turno apuestas si la siguiente carta será mayor o menor que la de encima.</li>
        <li>Aciertas: te salvas. Fallas: bebes 1 trago.</li>
        <li>
          Si la diferencia es de un solo número (por ejemplo hay un 6 y sale un 7): aciertas y es
          una <strong>sacada</strong> (no bebes, pero reparte un trago a cada uno de los demás);
          fallas y es una <strong>humillación</strong> (bebes 3 tragos).
        </li>
        <li>Empate a número (mismo valor, distinto palo): se beben siempre 2 tragos.</li>
        <li>
          Los 4 ases (bastada, copazo, sablada, lingotazo) son cartas especiales: pase lo que
          pase con tu apuesta, se bebe siempre 1 trago y no se suma nada más.
        </li>
        <li>
          El 3 de copas (<strong>tres copas</strong>) funciona igual: siempre son exactamente 3
          tragos, sin sumar nada más.
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ loading: boolean; error: string | null }>()
const emit = defineEmits<{ (e: 'start', players: string[]): void }>()

const draftName = ref('')
const players = ref<string[]>([])

function addPlayer(): void {
  const name = draftName.value.trim()
  if (!name) return
  players.value.push(name)
  draftName.value = ''
}

function removePlayer(index: number): void {
  players.value.splice(index, 1)
}

function handleSubmit(): void {
  emit('start', players.value)
}
</script>

<style scoped>
.player-setup {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-5);
  text-align: center;
}

.player-setup__subtitle {
  margin: calc(var(--sp-3) * -1) 0 0;
}

.player-setup__form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.player-setup__input-row {
  display: flex;
  gap: var(--sp-2);
}

.player-setup__input {
  flex: 1;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  font-size: var(--fs-body);
  color: var(--fg-strong);
}

.player-setup__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  justify-content: center;
}

.player-setup__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--bg-warm);
  color: var(--fg-strong);
  border-radius: var(--r-pill);
  padding: var(--sp-1) var(--sp-2) var(--sp-1) var(--sp-4);
  font-size: var(--fs-body-sm);
}

.player-setup__remove {
  border: none;
  background: transparent;
  color: var(--fg-strong);
  font-size: 18px;
  line-height: 1;
  padding: var(--sp-1);
}

.player-setup__start {
  margin-top: var(--sp-2);
}

.player-setup__error {
  color: #b23b3b;
}

.player-setup__rules {
  width: 100%;
  text-align: left;
  background: var(--bg-soft);
  border-radius: var(--r-md);
  padding: var(--sp-5);
}

.player-setup__rules ul {
  margin: var(--sp-3) 0 0;
  padding-left: var(--sp-5);
  color: var(--fg-muted);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
</style>
