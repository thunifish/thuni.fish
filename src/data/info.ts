import type { ImageMetadata } from "astro";

import t1 from "@/assets/thumbs/hanako.jpg";
import t2 from "@/assets/thumbs/kaworu.jpg";
import t3 from "@/assets/thumbs/basil.jpg";
import t4 from "@/assets/thumbs/miyano.jpg";
import t5 from "@/assets/thumbs/mafuyu.jpg";
import t6 from "@/assets/thumbs/yoshiki.jpg";
import t7 from "@/assets/thumbs/hirose.jpg";
import t8 from "@/assets/thumbs/ranpo.jpg";
import type { MessageKey } from "@/i18n";

export type InfoThumb = {
  src: ImageMetadata;
  alt?: string;
};

export type InfoCardData = {
  titleKey: MessageKey;
  face?: string;
  leadKey?: MessageKey;
  textKey: MessageKey;
  thumbs?: InfoThumb[];
};

export const INFO_CARDS: InfoCardData[] = [
  {
    titleKey: "info.animes.title",
    face: "(˶ˆᗜˆ˵)",
    textKey: "info.animes.text",
    thumbs: [
      { src: t1, alt: "Hanako-Kun" },
      { src: t2, alt: "Kaworu Nagisa" },
    ],
  },
  {
    titleKey: "info.music.title",
    face: "(„• ֊ •„)",
    textKey: "info.music.text",
    thumbs: [
      { src: t3, alt: "Basil" },
      { src: t4, alt: "Miyano" },
    ],
  },
  {
    titleKey: "info.likes.title",
    face: "(˶ᵔ ᵕ ᵔ˶)",
    textKey: "info.likes.text",
    thumbs: [
      { src: t7, alt: "Hirose" },
      { src: t8, alt: "Ranpo" },
    ],
  },
  {
    titleKey: "info.dislikes.title",
    face: "૮(◞ ‸ ◟ )ა",
    textKey: "info.dislikes.text",
    thumbs: [
      { src: t5, alt: "Mafuyu" },
      { src: t6, alt: "Yoshiki" },
    ],
  },
];
