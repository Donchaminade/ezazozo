import { useCallback, useSyncExternalStore } from 'react';
import { prefersReducedMotion, REDUCED_MOTION_QUERY, subscribeToMotion } from '../lib/motion';

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};

/** The effective preference: the visitor's choice, else the OS `prefers-reduced-motion` setting. */
export const usePrefersReducedMotion = () => useSyncExternalStore(subscribeToMotion, prefersReducedMotion, () => false);

/** The OS setting alone, to explain why the site starts still. */
export const useSystemPrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
