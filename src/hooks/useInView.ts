import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Reveal-on-scroll helper: returns a ref and whether it has entered the
 * viewport. Under prefers-reduced-motion everything is visible immediately,
 * so reveal transitions never hide content from motion-sensitive users.
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.15,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, threshold]);

  return [ref, visible];
}
