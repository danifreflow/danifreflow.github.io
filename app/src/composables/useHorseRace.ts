import { computed, ref } from 'vue'

import { HorseRace, RaceError } from '@/game/horseRace'
import type { PlayerBet, RaceState } from '@/types/horseRace'

export function useHorseRace() {
  const race = ref<RaceState | null>(null)
  const bets = ref<PlayerBet[]>([])
  const drinks = ref<Record<string, number>>({})
  const error = ref<string | null>(null)
  let instance: HorseRace | null = null

  const winnerBets = computed(() => bets.value.filter((b) => b.horse === race.value?.winner))
  const loserBets = computed(() => bets.value.filter((b) => b.horse !== race.value?.winner))

  function startRace(playerBets: PlayerBet[]): void {
    instance = new HorseRace()
    bets.value = playerBets
    drinks.value = Object.fromEntries(playerBets.map((bet) => [bet.player, 0]))
    error.value = null
    race.value = instance.toState()

    if (race.value.finished) {
      applyLoserDrinks()
    }
  }

  function draw(): void {
    if (!instance || instance.finished) return
    error.value = null
    try {
      instance.draw()
      race.value = instance.toState()
      if (instance.finished) {
        applyLoserDrinks()
      }
    } catch (err) {
      error.value = err instanceof RaceError ? err.message : 'No se pudo continuar la carrera.'
    }
  }

  function applyLoserDrinks(): void {
    for (const bet of loserBets.value) {
      drinks.value[bet.player] = (drinks.value[bet.player] ?? 0) + bet.amount
    }
  }

  function distribute(toPlayer: string, amount: number): void {
    if (amount <= 0) return
    drinks.value[toPlayer] = (drinks.value[toPlayer] ?? 0) + amount
  }

  function reset(): void {
    instance = null
    race.value = null
    bets.value = []
    drinks.value = {}
    error.value = null
  }

  return { race, bets, drinks, error, winnerBets, loserBets, startRace, draw, distribute, reset }
}
