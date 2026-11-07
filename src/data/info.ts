export type InfoThumb = {
  src: string;
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
    title: "Lorem!",
    face: "(๑>◡<๑)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    thumbs: [
      { src: "https://placehold.co/600x400" },
      { src: "https://placehold.co/600x400" },
    ],
  },
  {
    title: "Ipsum!",
    face: "(− ᴗ −)",
    text: "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
    thumbs: [
      { src: "https://placehold.co/600x400" },
      { src: "https://placehold.co/600x400" },
    ],
  },
  {
    title: "Dolor!",
    text: "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    thumbs: [
      { src: "https://placehold.co/600x400" },
      { src: "https://placehold.co/600x400" },
    ],
  },
  {
    title: "Amet!",
    text: "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.",
    thumbs: [
      { src: "https://placehold.co/600x400" },
      { src: "https://placehold.co/600x400" },
    ],
  },
  {
    title: "Music!",
    lead: "Lorem",
    text: "ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Nulla quis sem at nibh elementum imperdiet.",
  },
  {
    title: "Favs!",
    text: "Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.",
  },
];
