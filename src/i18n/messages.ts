export const LOCALES = ["pt", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export const LANG_TAG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export const pt = {
  "profile.label": "perfil do thom",
  "profile.avatarAlt": "avatar do thom",

  "theme.toggle": "Alternar tema",
  "theme.dark": "Ativar tema escuro",
  "theme.light": "Ativar tema claro",

  "lang.group": "Mudar idioma",
  "lang.pt": "português",
  "lang.en": "inglês",

  "enter.imageAlt": "Gato fofo",
  "enter.click": "(clica aqui!)",

  "footer.openSource": "o site é open source!",
  "footer.viewCode": "veja o codigo ↗",

  "intro.pronouns": "ele / dele · 16y · INFP-T",
  "intro.languages": "português e inglês",
  "intro.note": "nota!",
  "intro.greeting": "oii!! :)",

  "flags.label": "bandeiras",
  "flags.portugal": "bandeira de Portugal",
  "flags.pan": "bandeira pan",

  "links.title": "meus links!",
  "links.navLabel": "redes sociais e e-mail",
  "links.email": "me mandar um e-mail",
  "links.emailTitle": "e-mail",
  "links.twitter": "Twitter do Thom",
  "links.instagram": "Instagram do Thom",
  "links.tiktok": "TikTok do Thom",
  "links.spotify": "Spotify do Thom",
  "links.pinterest": "Pinterest do Thom",
  "links.roblox": "Roblox do Thom",
  "links.anilist": "Anilist do Thom",
  "links.steam": "Steam do Thom",
  "links.github": "GitHub do Thom",

  "info.label": "informações pessoais",
  "info.animes.title": "animes",
  "info.animes.text":
    "hanako-kun, evangelion, sasaki to miyano, nakamura-kun, given, silent voice, doukyuusei lain, tshd, bsd",
  "info.music.title": "música",
  "info.music.text":
    "cavetown, tv girl, yonlu, femtanyl, lil peep, sabrina carpinter, chico buarque, olivia rodrigo, wave to earth",
  "info.likes.title": "gosto:",
  "info.likes.text":
    "minha gata, sol, estudar, hístoria, ouvir música, falar com amigos, escrever, tecnologia, assistir séries, andar de bicicleta, e dormir",
  "info.dislikes.title": "não gosto",
  "info.dislikes.text":
    "chorar, chuva, pessoas secas, ficar sozinho, mto barulho, matemática, ficar entediado, preconceito",

  "fish.label": "girar o peixe",

  "player.label": "Música a tocar",
  "player.empty": "sem música por enquanto",
  "player.playing": "tocando agora...",
  "player.paused": "em pausa",
  "player.loading": "a procurar música...",
  "player.error": "não consegui tocar essa música :(",
  "player.addSongs": "adiciona sons em {path} pra começa a ouvi :3",
  "player.resume": "Continuar música",
  "player.pause": "Pausar música",
  "player.next": "Próxima música",
  "player.progress": "Progresso da música",
  "player.timeValue": "{current} de {duration}",
  "player.fallbackArtist": "artista misterioso",
  "player.dialog.title": "créditos da música",
  "player.dialog.close": "Fechar créditos",
  "player.dialog.author": "autor / artista",
  "player.dialog.usage": "uso",
  "player.dialog.unknown": "não informado",
  "player.dialog.copyright": "© todos os direitos pertencem ao autor.",
  "player.dialog.source": "ver música original ↗",

  "notFound.badge": "ops!",
  "notFound.title": "perdeu o caminho?",
  "notFound.text": "essa página não existe.. :(",
  "notFound.back": "voltar pro início",
} as const;

export type MessageKey = keyof typeof pt;

export const en: Record<MessageKey, string> = {
  "profile.label": "thom's profile",
  "profile.avatarAlt": "thom's avatar",

  "theme.toggle": "Toggle theme",
  "theme.dark": "Enable dark theme",
  "theme.light": "Enable light theme",

  "lang.group": "Change language",
  "lang.pt": "Portuguese",
  "lang.en": "English",

  "enter.imageAlt": "Cute cat",
  "enter.click": "(click here!)",

  "footer.openSource": "this site is open source!",
  "footer.viewCode": "view the code ↗",

  "intro.pronouns": "he / him · 16y · INFP-T",
  "intro.languages": "portuguese and english",
  "intro.note": "note!",
  "intro.greeting": "hii!! :)",

  "flags.label": "flags",
  "flags.portugal": "flag of Portugal",
  "flags.pan": "pan flag",

  "links.title": "my links!",
  "links.navLabel": "social media and email",
  "links.email": "send me an email",
  "links.emailTitle": "e-mail",
  "links.twitter": "Thom's Twitter",
  "links.instagram": "Thom's Instagram",
  "links.tiktok": "Thom's TikTok",
  "links.spotify": "Thom's Spotify",
  "links.pinterest": "Thom's Pinterest",
  "links.roblox": "Thom's Roblox",
  "links.anilist": "Thom's Anilist",
  "links.steam": "Thom's Steam",
  "links.github": "Thom's GitHub",

  "info.label": "personal information",
  "info.animes.title": "animes",
  "info.animes.text":
    "hanako-kun, evangelion, sasaki to miyano, nakamura-kun, given, silent voice, doukyuusei lain, tshd, bsd",
  "info.music.title": "music",
  "info.music.text":
    "cavetown, tv girl, yonlu, femtanyl, lil peep, sabrina carpinter, chico buarque, olivia rodrigo, wave to earth",
  "info.likes.title": "likes:",
  "info.likes.text":
    "my cat, sun, studying, history, listening to music, talking to friends, writing, technology, watching series, riding bikes, and sleeping",
  "info.dislikes.title": "dislikes",
  "info.dislikes.text":
    "crying, rain, dry people, being alone, too much noise, math, being bored, prejudice",

  "fish.label": "spin the fish",

  "player.label": "Now playing",
  "player.empty": "no music for now",
  "player.playing": "now playing...",
  "player.paused": "paused",
  "player.loading": "looking for music...",
  "player.error": "couldn't play this song :(",
  "player.addSongs": "add songs to {path} to start listening :3",
  "player.resume": "Resume music",
  "player.pause": "Pause music",
  "player.next": "Next song",
  "player.progress": "Song progress",
  "player.timeValue": "{current} of {duration}",
  "player.fallbackArtist": "mysterious artist",
  "player.dialog.title": "song credits",
  "player.dialog.close": "Close credits",
  "player.dialog.author": "author / artist",
  "player.dialog.usage": "usage",
  "player.dialog.unknown": "not provided",
  "player.dialog.copyright": "© all rights belong to the author.",
  "player.dialog.source": "view original song ↗",

  "notFound.badge": "oops!",
  "notFound.title": "lost your way?",
  "notFound.text": "this page doesn't exist.. :(",
  "notFound.back": "back to home",
};

export const messages = { pt, en } satisfies Record<
  Locale,
  Record<MessageKey, string>
>;
