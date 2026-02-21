export type Theme = "light" | "dark";
export type ThemeMode = Theme | "system";

export const THEME_MODE_STORAGE_KEY = "theme-mode";
export const LEGACY_THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || isTheme(value);
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(mode: ThemeMode, systemTheme: Theme): Theme {
  return mode === "system" ? systemTheme : mode;
}

export const THEME_INIT_SCRIPT = `
(() => {
  try {
    const storedMode = localStorage.getItem("${THEME_MODE_STORAGE_KEY}");
    const legacyTheme = localStorage.getItem("${LEGACY_THEME_STORAGE_KEY}");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const mode =
      storedMode === "light" || storedMode === "dark" || storedMode === "system"
        ? storedMode
        : legacyTheme === "light" || legacyTheme === "dark"
          ? legacyTheme
          : "system";
    const theme = mode === "system" ? systemTheme : mode;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_error) {
    document.documentElement.dataset.themeMode = "system";
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;
