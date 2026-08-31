/**
 * Reproductor mínimo basado en la IFrame Player API oficial de YouTube.
 * No descarga ni aloja ningún audio: solo referencia el vídeo y lo controla
 * (play/pause/mute) desde el iframe que sirve YouTube.
 */

export interface YoutubePlayerHandle {
  play(): void
  pause(): void
  mute(): void
  unmute(): void
  destroy(): void
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, options: Record<string, unknown>) => YtPlayerInstance
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YtPlayerInstance {
  playVideo(): void
  pauseVideo(): void
  mute(): void
  unMute(): void
  destroy(): void
}

let apiPromise: Promise<void> | null = null

function loadYoutubeApi(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }
  if (window.YT?.Player) {
    return Promise.resolve()
  }
  if (apiPromise) {
    return apiPromise
  }

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })

  return apiPromise
}

export async function createYoutubePlayer(
  elementId: string,
  videoId: string,
): Promise<YoutubePlayerHandle> {
  await loadYoutubeApi()

  return new Promise((resolve) => {
    const player = new window.YT!.Player(elementId, {
      videoId,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: videoId,
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          resolve({
            play: () => player.playVideo(),
            pause: () => player.pauseVideo(),
            mute: () => player.mute(),
            unmute: () => player.unMute(),
            destroy: () => player.destroy(),
          })
        },
      },
    })
  })
}
