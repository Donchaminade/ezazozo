import { useLayoutEffect, useRef, type RefObject } from 'react';
import { lockScroll } from '../lib/scroll';

const escapeHandlers: Array<() => void> = [];

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || escapeHandlers.length === 0) return;
  event.preventDefault();
  escapeHandlers[escapeHandlers.length - 1]();
};

/**
 * While `open`: the page behind stays put, Escape closes the overlay (topmost first when they stack) and
 * hands focus back to whatever opened it. `panelRef`, when given, receives focus on open.
 */
export const useOverlay = (open: boolean, onClose: () => void, panelRef?: RefObject<HTMLElement | null>) => {
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    const release = lockScroll();
    panelRef?.current?.focus({ preventScroll: true });

    const onEscape = () => {
      onCloseRef.current();
      opener?.focus({ preventScroll: true });
    };
    escapeHandlers.push(onEscape);
    if (escapeHandlers.length === 1) document.addEventListener('keydown', onKeyDown);

    return () => {
      release();
      escapeHandlers.splice(escapeHandlers.indexOf(onEscape), 1);
      if (escapeHandlers.length === 0) document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
};
