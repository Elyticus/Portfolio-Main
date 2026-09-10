import { useEffect, useState } from "react";

const TYPE_MS = 80;
const DELETE_MS = 50;
const HOLD_MS = 1800;
const SWAP_MS = 3000;

/**
 * Typewriter effect: types a word, holds it, deletes it, then moves on to the
 * next one. Starts with the first word fully shown so the first paint is never
 * blank. Under prefers-reduced-motion the words swap whole instead of being
 * typed letter by letter.
 */
export function useTypewriter(words: readonly string[]) {
  const [reduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const holding = !deleting && length === words[wordIndex].length;

    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (reduceMotion) delay = SWAP_MS;
    else if (holding) delay = HOLD_MS;

    const timer = setTimeout(() => {
      if (reduceMotion) {
        const next = (wordIndex + 1) % words.length;
        setWordIndex(next);
        setLength(words[next].length);
      } else if (holding) {
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      } else {
        setLength(length + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [words, wordIndex, length, deleting, reduceMotion]);

  return words[wordIndex].slice(0, length);
}
