import { THEME } from "@/config";
import { onLocaleChange, t } from "@/i18n";

type Theme = keyof typeof THEME.colors;

const THEME_KEY = THEME.key;
const THEME_COLORS = THEME.colors;

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

export function initTheme(): void {
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

    const label = root.classList.contains("dark")
      ? t("theme.light")
      : t("theme.dark");

    toggle.setAttribute("aria-label", label);
    toggle.title = t("theme.toggle");
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

  onLocaleChange(syncLabel);
}
