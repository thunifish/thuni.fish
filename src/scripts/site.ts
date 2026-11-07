type Track = {
  file: string;
  title?: string;
  artist?: string;
  author?: string;
  copyright?: string;
  source?: string;
};

function isTrack(value: unknown): value is Track {
  return (
    typeof value === "object" &&
    value !== null &&
    "file" in value &&
    typeof (value as { file: unknown }).file === "string"
  );
}

function init() {
  const enterScreen = document.querySelector<HTMLElement>(
    "[data-enter-screen]",
  );
  const enterButton = document.querySelector<HTMLButtonElement>("[data-enter]");
  const main = document.querySelector<HTMLElement>("[data-main]");
  const portrait = document.querySelector<HTMLElement>("[data-portrait]");
  const avatar = document.querySelector<HTMLImageElement>("[data-avatar]");
  const trackTitle = document.querySelector<HTMLElement>("[data-track-title]");
  const trackArtist = document.querySelector<HTMLElement>(
    "[data-track-artist]",
  );
  const trackInfo =
    document.querySelector<HTMLButtonElement>("[data-track-info]");
  const pauseButton = document.querySelector<HTMLButtonElement>("[data-pause]");
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
    !trackTitle ||
    !trackArtist ||
    !trackInfo ||
    !pauseButton ||
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
  let audio: HTMLAudioElement | null = null;
  let entered = false;
  let ready: Promise<void> = Promise.resolve();
  let lastPlayedFile: string | null = null;

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

  function setPlaying(playing: boolean) {
    pauseButton!.dataset.playing = playing ? "true" : "false";
    pauseButton!.setAttribute(
      "aria-label",
      playing ? "Pausar música" : "Continuar música",
    );
    pauseButton!.title = playing ? "Pausar música" : "Continuar música";
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
        : "artista misterioso");
    trackInfo!.disabled = !hasTrack;
    pauseButton!.disabled = !hasTrack;

    creditTitle!.textContent = next?.title || next?.file || "—";
    creditArtist!.textContent = next?.artist || "artista misterioso";
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
      audio?.pause();
      audio = null;
      lastPlayedFile = null;
      applyTrack(null);
      setPlaying(false);
      return;
    }

    audio?.pause();
    const nextAudio = new Audio(`/sounds/${next.file}`);
    nextAudio.volume = 0.42;
    nextAudio.preload = "auto";
    nextAudio.onended = () => {
      audio = null;
      setPlaying(false);

      if (sounds.length <= 1) {
        applyTrack(next);
        return;
      }

      const followingTrack = getNextTrack(next.file);
      if (followingTrack) {
        startTrack(followingTrack);
      } else {
        applyTrack(null);
      }
    };
    nextAudio.onerror = () => {
      audio = null;
      setPlaying(false);

      if (sounds.length <= 1) {
        applyTrack(next);
        return;
      }

      const fallbackTrack = getNextTrack(next.file);
      if (fallbackTrack) {
        startTrack(fallbackTrack);
      } else {
        applyTrack(null);
      }
    };

    audio = nextAudio;
    lastPlayedFile = next.file;
    applyTrack(next);
    nextAudio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false);
      });
  }

  function playRandom() {
    const next = getNextTrack(lastPlayedFile);
    startTrack(next);
  }

  async function onEnter() {
    if (entered) return;
    await ready;
    playRandom();
    entered = true;
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

  pauseButton.addEventListener("click", () => {
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  trackInfo.addEventListener("click", () => {
    if (!track) return;
    dialog.showModal();
  });

  closeDialog.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  fishButton.addEventListener("click", () => {
    fishEmoji.classList.remove("is-spinning");
    void fishEmoji.offsetWidth;
    fishEmoji.classList.add("is-spinning");
  });

  avatar?.addEventListener("error", () => {
    portrait?.classList.add("is-broken");
  });

  applyTrack(null);
  window.addEventListener("pagehide", () => audio?.pause());
}

init();
