import {
  DEFAULT_LOCALE,
  LANG_TAG,
  LOCALES,
  messages,
  type Locale,
  type MessageKey,
} from "./messages";

export {
  DEFAULT_LOCALE,
  LANG_TAG,
  LOCALES,
  messages,
  type Locale,
  type MessageKey,
};

const LANG_KEY = "lang";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

export function getStoredLocale(): Locale | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const value = localStorage.getItem(LANG_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function detectLocale(): Locale {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return DEFAULT_LOCALE;
  }

  const stored = getStoredLocale();
  if (stored) return stored;

  const preferred =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const tag of preferred) {
    const code = tag.toLowerCase();
    if (code === "pt" || code.startsWith("pt-")) return "pt";
    if (code === "en" || code.startsWith("en-")) return "en";
  }

  return DEFAULT_LOCALE;
}

let currentLocale: Locale | null = null;

export function getLocale(): Locale {
  currentLocale ??= detectLocale();
  return currentLocale;
}

function interpolate(
  text: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return text;

  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function t(
  key: MessageKey,
  vars?: Record<string, string | number>,
  locale: Locale = getLocale(),
): string {
  const text = messages[locale]?.[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
  return interpolate(text, vars);
}

const I18N_ATTRIBUTES = ["aria-label", "title", "alt"] as const;

function translateNode(root: ParentNode, locale: Locale): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key && key in messages[locale]) {
      element.textContent = messages[locale][key as MessageKey];
    }
  });

  for (const attribute of I18N_ATTRIBUTES) {
    const selector = `[data-i18n-${attribute}]`;
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      const key = element.getAttribute(`data-i18n-${attribute}`);
      if (key && key in messages[locale]) {
        element.setAttribute(attribute, messages[locale][key as MessageKey]);
      }
    });
  }
}

function syncLangButtons(locale: Locale): void {
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === locale));
  });
}

export function applyLocale(locale: Locale = getLocale()): void {
  currentLocale = locale;

  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.lang = LANG_TAG[locale];
  root.dataset.locale = locale;

  translateNode(document, locale);
  syncLangButtons(locale);

  document.dispatchEvent(new CustomEvent("localechange", { detail: locale }));
}

export function setLocale(locale: Locale): void {
  if (locale === getLocale()) return;

  currentLocale = locale;

  try {
    localStorage.setItem(LANG_KEY, locale);
  } catch {}

  applyLocale(locale);
}

export function initI18n(): void {
  if (typeof document === "undefined") return;

  currentLocale = detectLocale();
  applyLocale(currentLocale);

  document
    .querySelectorAll<HTMLButtonElement>("[data-lang]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (isLocale(button.dataset.lang)) setLocale(button.dataset.lang);
      });
    });

  window.addEventListener("storage", (event) => {
    if (event.key !== LANG_KEY) return;

    const locale = isLocale(event.newValue) ? event.newValue : detectLocale();
    if (locale !== getLocale()) applyLocale(locale);
  });
}

export function onLocaleChange(handler: (locale: Locale) => void): void {
  document.addEventListener("localechange", () => handler(getLocale()));
}
