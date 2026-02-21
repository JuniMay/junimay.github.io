"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  getSystemTheme,
  isTheme,
  isThemeMode,
  LEGACY_THEME_STORAGE_KEY,
  resolveTheme,
  THEME_MODE_STORAGE_KEY,
  type ThemeMode,
} from "../lib/theme";

// Keep top-level routes in a single array so adding pages only changes one place.
const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

const themeModes: Array<{ value: ThemeMode; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Auto" },
];

const THEME_MODE_SYNC_EVENT = "theme-mode-sync";

function readThemeModeFromBrowser(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  // The layout script decides the theme before paint; read that value first.
  const modeFromDom = document.documentElement.dataset.themeMode;
  if (isThemeMode(modeFromDom)) {
    return modeFromDom;
  }

  // Backward compatibility with old storage key.
  try {
    const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (isThemeMode(storedMode)) {
      return storedMode;
    }
    if (isTheme(legacyTheme)) {
      return legacyTheme;
    }
  } catch (_error) {
    // Ignore storage errors and use system fallback.
  }

  return "system";
}

function applyThemeMode(mode: ThemeMode): void {
  const resolvedTheme = resolveTheme(mode, getSystemTheme());
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;

  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
    if (mode === "system") {
      localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, mode);
    }
  } catch (_error) {
    // Ignore storage issues and keep runtime theme applied.
  }
}

function subscribeThemeModeChange(callback: () => void): () => void {
  window.addEventListener(THEME_MODE_SYNC_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_MODE_SYNC_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerThemeModeSnapshot(): ThemeMode {
  return "system";
}

const Navbar = () => {
  const pathname = usePathname();
  const themeMode = useSyncExternalStore(
    subscribeThemeModeChange,
    readThemeModeFromBrowser,
    getServerThemeModeSnapshot,
  );

  useEffect(() => {
    // Keep the resolved theme in sync when OS preference changes under system mode.
    if (themeMode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const handleSystemChange = () => {
      applyThemeMode("system");
      window.dispatchEvent(new Event(THEME_MODE_SYNC_EVENT));
    };

    // Support both modern and older Safari event APIs.
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else {
      legacyMediaQuery.addListener?.(handleSystemChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleSystemChange);
      } else {
        legacyMediaQuery.removeListener?.(handleSystemChange);
      }
    };
  }, [themeMode]);

  const handleThemeModeSelect = (mode: ThemeMode) => {
    applyThemeMode(mode);
    window.dispatchEvent(new Event(THEME_MODE_SYNC_EVENT));
  };

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link href="/" className="brand">
          juni.blog
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              data-active={pathname === item.href ? "true" : "false"}
            >
              {item.label}
            </Link>
          ))}

          <div className="theme-switch" role="group" aria-label="Theme mode">
            {themeModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                className="theme-option"
                onClick={() => handleThemeModeSelect(mode.value)}
                data-active={themeMode === mode.value ? "true" : "false"}
                aria-pressed={themeMode === mode.value}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <Link
            href="https://github.com/JuniMay"
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
          >
            <FontAwesomeIcon icon={faGithub} className="icon-image" />
          </Link>

          <Link
            href="https://www.linkedin.com/in/junyi-mei-35b524304/"
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
          >
            <FontAwesomeIcon icon={faLinkedin} className="icon-image" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
