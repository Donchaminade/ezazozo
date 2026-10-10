import { useCallback, useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY } from '../lib/scroll';

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

export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
