import type { ImageMetadata } from "astro";

import t1 from "@/assets/thumbs/hanako.jpg";
import t2 from "@/assets/thumbs/kaworu.jpg";
import t3 from "@/assets/thumbs/basil.jpg";
import t4 from "@/assets/thumbs/miyano.jpg";
import t5 from "@/assets/thumbs/mafuyu.jpg";
import t6 from "@/assets/thumbs/yoshiki.jpg";
import t7 from "@/assets/thumbs/hirose.jpg";
import t8 from "@/assets/thumbs/ranpo.jpg";

export type InfoThumb = {
  src: ImageMetadata;
  alt?: string;
};

export type InfoCardData = {
  title: string;
  face?: string;
  lead?: string;
  text: string;
  thumbs?: InfoThumb[];
};

export const INFO_CARDS: InfoCardData[] = [
  {
    title: "animes",
    face: "(˶ˆᗜˆ˵)",
    text: "hanako-kun, evangelion, sasaki to miyano, nakamura-kun, given, silent voice, doukyuusei lain, tshd, bsd",
    thumbs: [
      { src: t1, alt: "Hanako-Kun" },
      { src: t2, alt: "Kaworu Nagisa" },
    ],
  },
  {
    title: "música",
    face: "(„• ֊ •„)",
    text: "cavetown, tv girl, yonlu, femtanyl, lil peep, sabrina carpinter, chico buarque, olivia rodrigo, wave to earth",
    thumbs: [
      { src: t3, alt: "Basil" },
      { src: t4, alt: "Miyano" },
    ],
  },
  {
    title: "gosto:",
    face: "(˶ᵔ ᵕ ᵔ˶)",
    text: "minha gata, sol, estudar, hístoria, ouvir música, falar com amigos, escrever,  tecnologia, assistir séries, andar de bicicleta, e dormir",
    thumbs: [
      { src: t7, alt: "Hirose" },
      { src: t8, alt: "Ranpo" },
    ],
  },
  {
    title: "não gosto",
    face: "૮(◞ ‸ ◟ )ა",
    text: "chorar, chuva, pessoas secas, ficar sozinho, mto barulho, matemática, ficar entediado, preconceito",
    thumbs: [
      { src: t5, alt: "Mafuyu" },
      { src: t6, alt: "Yoshiki" },
    ],
  },
];
