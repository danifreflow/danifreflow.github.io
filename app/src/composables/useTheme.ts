import { onMounted, ref, watch } from 'vue'

export type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'mayor-menor-theme'

export function useTheme() {
  const theme = ref<ThemePreference>('light')

  onMounted(() => {
    // El tema inicial ya lo aplica un script inline en index.html (evita el
    // parpadeo al cargar); aquí solo reflejamos ese valor en el estado reactivo.
    theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  })

  watch(theme, (value) => {
    document.documentElement.dataset.theme = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // localStorage puede no estar disponible (modo privado, cuotas, etc.).
    }
  })

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
