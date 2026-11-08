import type { MessageKey } from "@/i18n";

export const LINKS = [
  {
    icon: "simple-icons:x",
    href: "https://x.com/thunifish",
    labelKey: "links.twitter",
  },
  {
    icon: "simple-icons:instagram",
    href: "https://instagram.com/thunifish",
    labelKey: "links.instagram",
  },
  {
    icon: "simple-icons:tiktok",
    href: "https://tiktok.com/@thunifish",
    labelKey: "links.tiktok",
  },
  {
    icon: "simple-icons:spotify",
    href: "https://open.spotify.com/user/317hs76ivw45qyu4bt34uhdfzv4i",
    labelKey: "links.spotify",
  },
  {
    icon: "simple-icons:pinterest",
    href: "https://pinterest.com/thunifish/",
    labelKey: "links.pinterest",
  },
  {
    icon: "simple-icons:roblox",
    href: "https://www.roblox.com/pt/users/11477824674/profile",
    labelKey: "links.roblox",
  },
  {
    icon: "simple-icons:anilist",
    href: "https://anilist.co/user/thuni/",
    labelKey: "links.anilist",
  },
  {
    icon: "simple-icons:steam",
    href: "https://steamcommunity.com/id/thunifish/",
    labelKey: "links.steam",
  },
  {
    icon: "simple-icons:github",
    href: "https://github.com/thunifish/",
    labelKey: "links.github",
  },
] as const satisfies ReadonlyArray<{
  icon: string;
  href: string;
  labelKey: MessageKey;
}>;
