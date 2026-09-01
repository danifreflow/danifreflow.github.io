<template>
  <div class="fn-player">
    <div class="fn-player__frame">
      <div :id="elementId"></div>
    </div>
    <div class="fn-player__controls">
      <span class="fn-player__label body-sm">Sonando: Full Nelson (Limp Bizkit)</span>
      <button type="button" class="fn-player__btn" @click="toggleMute">
        {{ muted ? 'Activar sonido' : 'Silenciar' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { createYoutubePlayer } from '@/music/youtube'
import type { YoutubePlayerHandle } from '@/music/youtube'

const FULL_NELSON_VIDEO_ID = 'zsX0zHB4LwE'

const elementId = `fn-yt-${Math.random().toString(36).slice(2)}`
const muted = ref(false)
let handle: YoutubePlayerHandle | null = null

onMounted(async () => {
  handle = await createYoutubePlayer(elementId, FULL_NELSON_VIDEO_ID)
  handle.play()
})

onBeforeUnmount(() => {
  handle?.destroy()
})

function toggleMute(): void {
  if (!handle) return
  if (muted.value) {
    handle.unmute()
  } else {
    handle.mute()
  }
  muted.value = !muted.value
}
</script>

<style scoped>
.fn-player {
  position: fixed;
  right: var(--sp-4);
  bottom: var(--sp-4);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--sp-2);
}

.fn-player__frame {
  width: 160px;
  height: 90px;
  border-radius: var(--r-sm);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: var(--base-black);
}

.fn-player__frame :deep(iframe) {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

.fn-player__controls {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--bg);
  border-radius: var(--r-pill);
  padding: var(--sp-1) var(--sp-3);
  box-shadow: var(--shadow-md);
  max-width: 260px;
}

.fn-player__label {
  color: var(--fg-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fn-player__btn {
  border: none;
  background: #8e24aa;
  color: var(--fg-inverse);
  border-radius: var(--r-pill);
  padding: var(--sp-1) var(--sp-3);
  font-size: var(--fs-caption);
  text-transform: uppercase;
  letter-spacing: var(--tracking-caption);
  flex-shrink: 0;
}

/* En pantallas estrechas, el reproductor pasa a la esquina superior
   izquierda (la inferior derecha la ocupan los botones de apuesta) y se
   reduce a lo mínimo: solo la miniatura y el botón de silenciar. */
@media (max-width: 480px) {
  .fn-player {
    top: var(--sp-4);
    bottom: auto;
    left: var(--sp-4);
    right: auto;
    align-items: flex-start;
  }

  .fn-player__frame {
    width: 88px;
    height: 50px;
  }

  .fn-player__label {
    display: none;
  }

  .fn-player__controls {
    max-width: none;
    padding: var(--sp-1);
  }
}
</style>
