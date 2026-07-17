import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Single source of truth for the theme. The initial value is read from the
 * `.dark` class that the inline script in index.html applies before first
 * paint, so React never disagrees with what's already on screen.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // storage unavailable (private mode) — theme still applies for the session
    }
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, toggle };
}
