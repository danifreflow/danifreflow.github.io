/**
 * Imágenes reales de las 40 cartas, recortadas de una baraja española
 * completa (Creative Commons). No hay imagen para el comodín "Popo-popo-per"
 * (no existe en la baraja española): ese sigue dibujándose con SVG.
 */

const modules = import.meta.glob('../assets/cards/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const CARD_IMAGES: Record<string, string> = {}

for (const [path, url] of Object.entries(modules)) {
  const code = path.split('/').pop()?.replace('.png', '')
  if (code) {
    CARD_IMAGES[code] = url
  }
}

export function cardImageUrl(code: string): string | undefined {
  return CARD_IMAGES[code]
}
