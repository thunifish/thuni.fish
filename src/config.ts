export const SITE = {
  name: "thuni.fish",
  url: "https://thuni.fish",
  title: "thom",
  description: "cantigo do thom na internet (≧◡≦)",
  author: "thom",
  handle: "@thunifish",
  alternateNames: ["thom", "thuni"],
  lang: "pt-BR",
  locale: "pt_BR",
  languages: ["pt-BR"],
  image: "/og.png",
  imageAlt: "cantigo do thom na internet (≧◡≦)",
  twitter: {
    site: "@thunifish",
    creator: "@thunifish",
  },
} as const;

export const THEME = {
  key: "theme",
  colors: {
    light: "#fafafa",
    dark: "#0e0e0d",
  },
} as const;

export const PLAYER = {
  playlist: "/sounds/sounds.json",
  soundsPath: "/sounds/",
  fallbackArtist: "artista misterioso",
  volume: 0.3,
} as const;
