# Mayor o Menor

Juego de beber con baraja española (40 cartas), 100% en el navegador — sin backend.

En cada ronda apuestas si la siguiente carta será mayor o menor que la de encima:

- Aciertas: te salvas. Fallas: bebes 1 trago.
- Si la diferencia es de un solo número (p.ej. hay un 6 y sale un 7): aciertas y es una
  **sacada** (no bebes, reparte 1 trago a cada uno de los demás); fallas y es una
  **humillación** (bebes 3 tragos).
- Empate a número (mismo valor, distinto palo): siempre se beben 2 tragos.
- Los 4 ases (bastada, copazo, sablada, lingotazo) y el 3 de copas (tres copas) fijan
  su propio número de tragos y anulan cualquier otro cálculo de esa ronda.

## Estructura

- `app/` — código fuente (Vue 3 + TypeScript + Vite).
- `/` (raíz) — build estático publicado, servido directamente por GitHub Pages.

## Desarrollo

```bash
cd app
npm install
npm run dev
```

## Publicar cambios

```bash
cd app
npm install
npm run build
cp -r dist/. ..
```

Luego commitea y pushea el contenido de `app/` junto con los ficheros regenerados en la raíz.

## Créditos

Las imágenes de las cartas (`app/src/assets/cards/*.png`) son un recorte de
[Baraja española completa](https://commons.wikimedia.org/wiki/File:Baraja_espa%C3%B1ola_completa.png),
de **Basquetteur**, con licencia
[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.es). Al ser
"compartir igual", estos recortes se distribuyen bajo la misma licencia.
