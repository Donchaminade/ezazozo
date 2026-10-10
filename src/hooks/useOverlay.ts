import { useLayoutEffect, useRef, type RefObject } from 'react';
import { lockScroll } from '../lib/scroll';

const escapeHandlers: Array<() => void> = [];

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || escapeHandlers.length === 0) return;
  event.preventDefault();
  escapeHandlers[escapeHandlers.length - 1]();
};

/**
 * While `open`: the page behind stays put and Escape closes the overlay (topmost first when they stack).
 * `panelRef`, when given, receives focus on open. On close, focus left inside the panel (or dropped to the
 * body with the removed overlay) goes back to whatever opened it.
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
    const panel = panelRef?.current;
    panel?.focus({ preventScroll: true });

    const onEscape = () => onCloseRef.current();
    escapeHandlers.push(onEscape);
    if (escapeHandlers.length === 1) document.addEventListener('keydown', onKeyDown);

    return () => {
      release();
      escapeHandlers.splice(escapeHandlers.indexOf(onEscape), 1);
      if (escapeHandlers.length === 0) document.removeEventListener('keydown', onKeyDown);
      // After the commit: React ends it by re-focusing what had focus before (the panel, still mounted for its exit animation).
      queueMicrotask(() => {
        const active = document.activeElement;
        if (opener?.isConnected && (!active || active === document.body || panel?.contains(active))) {
          opener.focus({ preventScroll: true });
        }
      });
    };
  }, [open]);
};
