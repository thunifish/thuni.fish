import { PLAYER, SITE } from "@/config";
import { onLocaleChange, t } from "@/i18n";

type Track = {
  file: string;
  title?: string;
  artist?: string;
  author?: string;
  copyright?: string;
  source?: string;
};

type StatusOverride = "loading" | "error" | null;

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
  const creditSourceSlot = document.querySelector<HTMLElement>(
    "[data-credit-source-slot]",
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
    !dialog ||
    !creditTitle ||
    !creditArtist ||
    !creditAuthor ||
    !creditCopyright ||
    !creditSourceSlot ||
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
  let statusOverride: StatusOverride = null;
  let ready: Promise<void> = Promise.resolve();
  let dialogClosing = false;
  let dialogCloseTimer: number | null = null;

  const dialogCloseDelay = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches
    ? 0
    : 150;

  enterButton.focus();

  ready = fetch(PLAYER.playlist, { cache: "no-store" })
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
    if (statusOverride === "loading") {
      playerStatus!.textContent = t("player.loading");
      return;
    }

    if (statusOverride === "error") {
      playerStatus!.textContent = t("player.error");
      return;
    }

    if (!track) {
      playerStatus!.textContent = t("player.empty");
      return;
    }

    playerStatus!.textContent = playing
      ? t("player.playing")
      : t("player.paused");
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
      artist: next.artist || t("player.fallbackArtist"),
      album: next.author || SITE.name,
      artwork: artworkSrc
        ? [{ src: artworkSrc, sizes: artworkSize, type: "image/webp" }]
        : [],
    });
  }

  function syncPauseLabel() {
    const label = playing ? t("player.pause") : t("player.resume");
    pauseButton!.setAttribute("aria-label", label);
    pauseButton!.title = label;
  }

  function setPlaying(nextPlaying: boolean) {
    playing = nextPlaying;
    player!.dataset.playing = nextPlaying ? "true" : "false";
    pauseButton!.dataset.playing = nextPlaying ? "true" : "false";
    syncPauseLabel();

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
      t("player.timeValue", {
        current: formatTime(current),
        duration: formatTime(duration),
      }),
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

  function playlistHint() {
    return t("player.addSongs", {
      path: PLAYER.playlist.replace(/^\//, ""),
    });
  }

  function renderTrack() {
    const next = track;

    trackTitle!.textContent = next?.title || next?.file || t("player.empty");
    trackArtist!.textContent =
      next?.artist ||
      (sounds.length === 0 ? playlistHint() : t("player.fallbackArtist"));

    creditTitle!.textContent = next?.title || next?.file || "—";
    creditArtist!.textContent = next?.artist || t("player.fallbackArtist");
    creditAuthor!.textContent =
      next?.author || next?.artist || t("player.dialog.unknown");
    creditCopyright!.textContent =
      next?.copyright || t("player.dialog.copyright");

    if (next?.source) {
      const sourceLink = document.createElement("a");
      sourceLink.className = "inline-block underline underline-offset-[3px]";
      sourceLink.href = next.source;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = t("player.dialog.source");

      creditSourceSlot!.replaceChildren(sourceLink);
      creditSourceSlot!.hidden = false;
    } else {
      creditSourceSlot!.replaceChildren();
      creditSourceSlot!.hidden = true;
    }
  }

  function applyTrack(next: Track | null) {
    track = next;
    const hasTrack = Boolean(next);

    trackInfo!.disabled = !hasTrack;
    pauseButton!.disabled = !hasTrack;
    nextButton!.disabled = !hasTrack;
    progress!.disabled = !hasTrack;

    statusOverride = null;
    renderStatus();
    if (!next) resetProgress();

    renderTrack();
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
    audio!.src = `${PLAYER.soundsPath}${encodeURIComponent(next.file)}`;
    audio!.volume = PLAYER.volume;
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
    statusOverride = "loading";
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

    statusOverride = "error";
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

  onLocaleChange(() => {
    syncPauseLabel();
    renderStatus();
    renderTrack();
    syncMediaMetadata(track);
    setTimeLabels(
      audio.currentTime,
      Number.isFinite(audio.duration) ? audio.duration : 0,
    );
  });

  applyTrack(null);
  window.addEventListener("pagehide", () => audio.pause());
}

init();
