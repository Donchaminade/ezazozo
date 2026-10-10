/**
 * Single answer to "may the site animate?". The visitor's explicit choice (kept in localStorage) wins;
 * otherwise the OS setting `prefers-reduced-motion` decides. The inline script in `index.html` applies
 * the same rule to `<html data-motion>` before first paint, which the `motion-safe:` / `motion-reduce:`
 * CSS variants key off.
 */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const STORAGE_KEY = 'eza-motion';

type MotionChoice = 'full' | 'reduce';

const isBrowser = typeof window !== 'undefined';

const readChoice = (): MotionChoice | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'full' || value === 'reduce' ? value : null;
  } catch {
    return null;
  }
};

let choice: MotionChoice | null = isBrowser ? readChoice() : null;
const listeners = new Set<() => void>();

export const systemPrefersReducedMotion = (): boolean =>
  isBrowser && window.matchMedia(REDUCED_MOTION_QUERY).matches;

export const prefersReducedMotion = (): boolean =>
  choice ? choice === 'reduce' : systemPrefersReducedMotion();

const apply = () => {
  document.documentElement.dataset.motion = prefersReducedMotion() ? 'reduce' : 'full';
  listeners.forEach((listener) => listener());
};

/** Picking what the OS already asks for drops the saved choice, so later OS changes are followed again. */
export const setPrefersReducedMotion = (reduce: boolean) => {
  choice = reduce === systemPrefersReducedMotion() ? null : reduce ? 'reduce' : 'full';
  try {
    if (choice) window.localStorage.setItem(STORAGE_KEY, choice);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the choice still holds for this visit.
  }
  apply();
};

export const subscribeToMotion = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

if (isBrowser) {
  window.matchMedia(REDUCED_MOTION_QUERY).addEventListener('change', apply);
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    choice = readChoice();
    apply();
  });
  apply();
}
