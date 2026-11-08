type Track = {
  file: string;
  title?: string;
  artist?: string;
  author?: string;
  copyright?: string;
  source?: string;
};

const FALLBACK_ARTIST = "artista misterioso";

const THEME_KEY = "theme";
const THEME_COLORS = {
  light: "#fafafa",
  dark: "#0e0e0d",
} as const;

type Theme = keyof typeof THEME_COLORS;

function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

function initTheme(): void {
  const root = document.documentElement;
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const toggle = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );

  const apply = (theme: Theme) => {
    const dark = theme === "dark";
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
    meta?.setAttribute("content", THEME_COLORS[theme]);
  };

  const syncLabel = () => {
    if (!toggle) return;
    toggle.setAttribute(
      "aria-label",
      root.classList.contains("dark")
        ? "Ativar tema claro"
        : "Ativar tema escuro",
    );
  };

  const stored = getStoredTheme();
  apply(stored ?? (media.matches ? "dark" : "light"));
  syncLabel();

  toggle?.addEventListener("click", () => {
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    apply(next);
    setStoredTheme(next);
    syncLabel();
  });

  media.addEventListener("change", (event) => {
    if (getStoredTheme()) return;
    apply(event.matches ? "dark" : "light");
    syncLabel();
  });
}

initTheme();

function isTrack(value: unknown): value is Track {
  return (
    typeof value === "object" &&
    value !== null &&
    "file" in value &&
    typeof (value as { file: unknown }).file === "string"
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;

  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function init() {
  const enterScreen = document.querySelector<HTMLElement>(
    "[data-enter-screen]",
  );
  const enterButton = document.querySelector<HTMLButtonElement>("[data-enter]");
  const main = document.querySelector<HTMLElement>("[data-main]");
  const avatar = document.querySelector<HTMLImageElement>("[data-avatar]");
  const player = document.querySelector<HTMLElement>("[data-player]");
  const playerStatus = document.querySelector<HTMLElement>(
    "[data-player-status]",
  );
  const audio = document.querySelector<HTMLAudioElement>("[data-audio]");
  const trackTitle = document.querySelector<HTMLElement>("[data-track-title]");
  const trackArtist = document.querySelector<HTMLElement>(
    "[data-track-artist]",
  );
  const trackInfo =
    document.querySelector<HTMLButtonElement>("[data-track-info]");
  const pauseButton = document.querySelector<HTMLButtonElement>("[data-pause]");
  const nextButton = document.querySelector<HTMLButtonElement>("[data-next]");
  const progress = document.querySelector<HTMLInputElement>("[data-progress]");
  const timeCurrent = document.querySelector<HTMLElement>(
    "[data-time-current]",
  );
  const timeDuration = document.querySelector<HTMLElement>(
    "[data-time-duration]",
  );
  const fishButton = document.querySelector<HTMLButtonElement>("[data-fish]");
  const fishEmoji = document.querySelector<HTMLElement>("[data-fish-emoji]");
  const dialog = document.querySelector<HTMLDialogElement>(
    "[data-track-dialog]",
  );
  const creditTitle = document.querySelector<HTMLElement>(
    "[data-credit-title]",
  );
  const creditArtist = document.querySelector<HTMLElement>(
    "[data-credit-artist]",
  );
  const creditAuthor = document.querySelector<HTMLElement>(
    "[data-credit-author]",
  );
  const creditCopyright = document.querySelector<HTMLElement>(
    "[data-credit-copyright]",
  );
  const creditSource = document.querySelector<HTMLAnchorElement>(
    "[data-credit-source]",
  );
  const closeDialog = document.querySelector<HTMLButtonElement>(
    "[data-close-dialog]",
  );

  if (
    !enterScreen ||
    !enterButton ||
    !main ||
    !player ||
    !playerStatus ||
    !audio ||
    !trackTitle ||
    !trackArtist ||
    !trackInfo ||
    !pauseButton ||
    !nextButton ||
    !progress ||
    !timeCurrent ||
    !timeDuration ||
    !fishButton ||
    !fishEmoji ||
    !dialog ||
    !creditTitle ||
    !creditArtist ||
    !creditAuthor ||
    !creditCopyright ||
    !creditSource ||
    !closeDialog
  ) {
    return;
  }

  let sounds: Track[] = [];
  let track: Track | null = null;
  let entering = false;
  let entered = false;
  let playing = false;
  let isSeeking = false;
  let lastPlayedFile: string | null = null;
  let statusOverride: string | null = null;
  let ready: Promise<void> = Promise.resolve();
  let dialogClosing = false;
  let dialogCloseTimer: number | null = null;

  const dialogCloseDelay = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches
    ? 0
    : 150;

  enterButton.focus();

  ready = fetch("/sounds/sounds.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("sem playlist");
      return response.json() as Promise<unknown>;
    })
    .then((list) => {
      sounds = Array.isArray(list) ? list.filter(isTrack) : [];
    })
    .catch(() => {
      sounds = [];
    });

  function renderStatus() {
    if (statusOverride) {
      playerStatus!.textContent = statusOverride;
      return;
    }

    if (!track) {
      playerStatus!.textContent = "sem música por enquanto";
      return;
    }

    playerStatus!.textContent = playing ? "tocando agora..." : "em pausa";
  }

  function syncMediaPosition() {
    if (!("mediaSession" in navigator)) return;
    if (!("setPositionState" in navigator.mediaSession)) return;

    const { duration, currentTime, playbackRate } = audio!;
    if (!Number.isFinite(duration) || duration <= 0) return;

    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(Math.max(currentTime, 0), duration),
        playbackRate,
      });
    } catch {
      // Alguns navegadores rejeitam estados inconsistentes durante o seek.
    }
  }

  function syncMediaMetadata(next: Track | null) {
    if (!("mediaSession" in navigator)) return;

    if (!next) {
      navigator.mediaSession.metadata = null;
      return;
    }

    const artworkSrc = avatar?.currentSrc || avatar?.src;
    const artworkSize =
      avatar?.naturalWidth && avatar?.naturalHeight
        ? `${avatar.naturalWidth}x${avatar.naturalHeight}`
        : "460x460";

    navigator.mediaSession.metadata = new MediaMetadata({
      title: next.title || next.file,
      artist: next.artist || FALLBACK_ARTIST,
      album: next.author || "thuni.fish",
      artwork: artworkSrc
        ? [{ src: artworkSrc, sizes: artworkSize, type: "image/webp" }]
        : [],
    });
  }

  function setPlaying(nextPlaying: boolean) {
    playing = nextPlaying;
    player!.dataset.playing = nextPlaying ? "true" : "false";
    pauseButton!.dataset.playing = nextPlaying ? "true" : "false";
    pauseButton!.setAttribute(
      "aria-label",
      nextPlaying ? "Pausar música" : "Continuar música",
    );
    pauseButton!.title = nextPlaying ? "Pausar música" : "Continuar música";

    if (nextPlaying) statusOverride = null;
    renderStatus();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = nextPlaying ? "playing" : "paused";
    }
  }

  function paintProgress(percent: number) {
    const safePercent = Math.min(Math.max(percent, 0), 100);
    progress!.value = String(safePercent);
    progress!.style.setProperty(
      "--player-progress",
      `${safePercent.toFixed(2)}%`,
    );
  }

  function setTimeLabels(current: number, duration: number) {
    timeCurrent!.textContent = formatTime(current);
    timeDuration!.textContent = formatTime(duration);
    progress!.setAttribute(
      "aria-valuetext",
      `${formatTime(current)} de ${formatTime(duration)}`,
    );
  }

  function resetProgress() {
    isSeeking = false;
    paintProgress(0);
    setTimeLabels(0, 0);
  }

  function syncProgress() {
    if (isSeeking || !audio) return;

    const duration = audio.duration;
    const current = audio.currentTime;

    if (!Number.isFinite(duration) || duration <= 0) {
      paintProgress(0);
      setTimeLabels(current, 0);
      return;
    }

    paintProgress((current / duration) * 100);
    setTimeLabels(current, duration);
    syncMediaPosition();
  }

  function applyTrack(next: Track | null) {
    track = next;
    const hasTrack = Boolean(next);

    trackTitle!.textContent =
      next?.title || next?.file || "sem música por enquanto";
    trackArtist!.textContent =
      next?.artist ||
      (sounds.length === 0
        ? "adiciona sons em sounds/sounds.json pra começa a ouvi :3"
        : FALLBACK_ARTIST);
    trackInfo!.disabled = !hasTrack;
    pauseButton!.disabled = !hasTrack;
    nextButton!.disabled = !hasTrack;
    progress!.disabled = !hasTrack;

    statusOverride = null;
    renderStatus();
    if (!next) resetProgress();

    creditTitle!.textContent = next?.title || next?.file || "—";
    creditArtist!.textContent = next?.artist || FALLBACK_ARTIST;
    creditAuthor!.textContent = next?.author || next?.artist || "não informado";
    creditCopyright!.textContent =
      next?.copyright || "© todos os direitos pertencem ao autor.";

    if (next?.source) {
      creditSource!.hidden = false;
      creditSource!.href = next.source;
    } else {
      creditSource!.hidden = true;
      creditSource!.removeAttribute("href");
    }

    syncMediaMetadata(next);
  }

  function getNextTrack(excludeFile?: string | null): Track | null {
    if (sounds.length === 0) return null;

    const candidates = excludeFile
      ? sounds.filter((sound) => sound.file !== excludeFile)
      : [...sounds];

    if (candidates.length === 0) {
      return sounds[0] ?? null;
    }

    return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
  }

  function startTrack(next: Track | null) {
    if (!next) {
      audio!.pause();
      audio!.removeAttribute("src");
      audio!.load();
      lastPlayedFile = null;
      applyTrack(null);
      setPlaying(false);
      return;
    }

    audio!.pause();
    lastPlayedFile = next.file;
    audio!.loop = sounds.length <= 1;
    audio!.src = `/sounds/${encodeURIComponent(next.file)}`;
    audio!.volume = 0.42;
    applyTrack(next);
    setPlaying(false);
    resetProgress();

    audio!.play().catch(() => {
      setPlaying(false);
    });
  }

  function playNext() {
    if (sounds.length === 0) return;

    const followingTrack = getNextTrack(lastPlayedFile);
    startTrack(followingTrack);
  }

  async function onEnter() {
    if (entering || entered) return;

    entering = true;
    statusOverride = "a procurar música...";
    renderStatus();

    await ready;

    entered = true;
    statusOverride = null;

    if (sounds.length > 0) {
      playNext();
    } else {
      applyTrack(null);
    }

    enterScreen!.classList.add("is-hidden");
    main!.removeAttribute("aria-hidden");
    main!.removeAttribute("inert");
  }

  enterButton.addEventListener("click", () => {
    void onEnter();
  });

  enterScreen.addEventListener("transitionend", (event) => {
    if (
      event.target !== enterScreen ||
      !enterScreen.classList.contains("is-hidden")
    ) {
      return;
    }
    enterScreen.remove();
  });

  audio.addEventListener("play", () => {
    if (track) setPlaying(true);
  });

  audio.addEventListener("pause", () => {
    setPlaying(false);
  });

  audio.addEventListener("timeupdate", syncProgress);
  audio.addEventListener("durationchange", syncProgress);
  audio.addEventListener("loadedmetadata", syncProgress);

  audio.addEventListener("ended", () => {
    if (!track || sounds.length <= 1) return;

    const followingTrack = getNextTrack(track.file);
    if (followingTrack) {
      startTrack(followingTrack);
    } else {
      applyTrack(null);
    }
  });

  audio.addEventListener("error", () => {
    if (!track) return;

    statusOverride = "não consegui tocar essa música :(";
    audio.pause();
    setPlaying(false);
  });

  pauseButton.addEventListener("click", () => {
    if (!track) return;

    if (audio.paused) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  });

  nextButton.addEventListener("click", () => {
    playNext();
  });

  progress.addEventListener("pointerdown", () => {
    isSeeking = true;
  });

  progress.addEventListener("input", () => {
    if (!track) return;

    isSeeking = true;
    const percent = Number(progress.value);
    paintProgress(percent);

    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;

    const target = (percent / 100) * duration;
    audio.currentTime = target;
    setTimeLabels(target, duration);
  });

  function finishSeeking() {
    isSeeking = false;
    syncProgress();
  }

  progress.addEventListener("change", finishSeeking);
  progress.addEventListener("pointerup", finishSeeking);
  progress.addEventListener("keyup", finishSeeking);
  progress.addEventListener("blur", finishSeeking);

  function openDialog() {
    if (!track) return;

    if (dialogCloseTimer !== null) {
      window.clearTimeout(dialogCloseTimer);
      dialogCloseTimer = null;
    }

    dialogClosing = false;
    dialog!.removeAttribute("data-closing");

    if (!dialog!.open) dialog!.showModal();
  }

  function closeDialogAnimated() {
    if (!dialog!.open || dialogClosing) return;

    if (dialogCloseDelay === 0) {
      dialog!.close();
      return;
    }

    dialogClosing = true;
    dialog!.dataset.closing = "true";

    dialogCloseTimer = window.setTimeout(() => {
      dialog!.removeAttribute("data-closing");
      dialog!.close();
      dialogClosing = false;
      dialogCloseTimer = null;
    }, dialogCloseDelay);
  }

  dialog.addEventListener("close", () => {
    if (dialogCloseTimer !== null) {
      window.clearTimeout(dialogCloseTimer);
      dialogCloseTimer = null;
    }
    dialog.removeAttribute("data-closing");
    dialogClosing = false;
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialogAnimated();
  });

  trackInfo.addEventListener("click", openDialog);

  closeDialog.addEventListener("click", closeDialogAnimated);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialogAnimated();
  });

  fishButton.addEventListener("click", () => {
    fishEmoji.removeAttribute("data-spinning");
    void fishEmoji.offsetWidth;
    fishEmoji.dataset.spinning = "true";
  });

  avatar?.addEventListener("error", () => {
    avatar.hidden = true;
  });

  if ("mediaSession" in navigator) {
    const setHandler = (
      action: MediaSessionAction,
      handler: MediaSessionActionHandler | null,
    ) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Ação não suportada neste navegador.
      }
    };

    setHandler("play", () => {
      audio.play().catch(() => setPlaying(false));
    });
    setHandler("pause", () => audio.pause());
    setHandler("nexttrack", () => playNext());
    setHandler("seekto", (details) => {
      if (details.seekTime == null) return;
      audio.currentTime = details.seekTime;
      syncProgress();
    });
  }

  applyTrack(null);
  window.addEventListener("pagehide", () => audio.pause());
}

init();
