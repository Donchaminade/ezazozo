import { RefObject, useCallback, useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';

const DRAG_THRESHOLD = 6;

interface DragScrollOptions {
  /** Fling and glide animations; when false every move lands instantly (reduced motion). */
  inertia: boolean;
}

const clamp = (min: number, max: number, value: number) => Math.min(max, Math.max(min, value));

/**
 * Scroll positions where each `[data-slide]` child lines up where the first one starts.
 * Assumes the container is positioned and its scroll padding equals its padding.
 */
const snapPoints = (el: HTMLElement) => {
  const slides = el.querySelectorAll<HTMLElement>('[data-slide]');
  if (!slides.length) return [0];
  const start = slides[0].offsetLeft;
  const max = el.scrollWidth - el.clientWidth;
  return Array.from(slides, (slide) => clamp(0, max, slide.offsetLeft - start));
};

const nearest = (points: number[], value: number) =>
  points.reduce((best, point) => (Math.abs(point - value) < Math.abs(best - value) ? point : best), points[0]);

/**
 * Mouse drag-to-scroll with a fling and card snapping for a horizontal overflow container.
 * Touch and trackpads keep the browser's native scrolling and CSS scroll snapping.
 * The container gets `is-dragging` / `is-gliding` classes so CSS can suspend scroll snapping meanwhile.
 */
export const useDragScroll = (ref: RefObject<HTMLElement | null>, { inertia }: DragScrollOptions) => {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const stopGlide = useCallback(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
    ref.current?.classList.remove('is-gliding');
  }, [ref]);

  const glideTo = useCallback(
    (target: number, duration: number) => {
      const el = ref.current;
      if (!el) return;
      stopGlide();
      if (!inertia) {
        el.scrollLeft = target;
        return;
      }
      el.classList.add('is-gliding');
      tweenRef.current = gsap.to(el, {
        scrollLeft: target,
        duration,
        ease: 'power3.out',
        onComplete: stopGlide,
      });
    },
    [ref, inertia, stopGlide]
  );

  /** Moves by roughly one screenful of cards, landing on a card edge. */
  const page = useCallback(
    (direction: 1 | -1) => {
      const el = ref.current;
      if (!el) return;
      const points = snapPoints(el);
      const step = points.length > 1 ? points[1] - points[0] : el.clientWidth;
      const perPage = Math.max(1, Math.floor((el.clientWidth * 0.82) / Math.max(1, step)));
      const from = nearest(points, el.scrollLeft);
      const index = points.indexOf(from);
      const target = points[clamp(0, points.length - 1, index + direction * perPage)];
      glideTo(target, 0.85);
    },
    [ref, glideTo]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;
    let suppressClick = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      // Catching a glide freezes the rail where it is (snapping stays off until release)
      // and that press is not a click on a card.
      suppressClick = tweenRef.current !== null;
      tweenRef.current?.kill();
      tweenRef.current = null;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startLeft = el.scrollLeft;
      lastT = event.timeStamp;
      velocity = 0;
      dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        suppressClick = true;
        el.setPointerCapture(event.pointerId);
        el.classList.add('is-dragging');
        el.classList.remove('is-gliding');
      }
      const dt = Math.max(1, event.timeStamp - lastT);
      velocity = 0.75 * ((event.clientX - lastX) / dt) + 0.25 * velocity;
      lastX = event.clientX;
      lastT = event.timeStamp;
      el.scrollLeft = startLeft - dx;
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) {
        if (el.classList.contains('is-gliding')) glideTo(nearest(snapPoints(el), el.scrollLeft), 0.45);
        return;
      }
      dragging = false;
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      // A pointer that stopped before release should not fling.
      const fling = event.timeStamp - lastT > 80 ? 0 : velocity;
      const target = nearest(snapPoints(el), el.scrollLeft - fling * 300);
      // Start the glide before dropping `is-dragging`, or CSS snapping would jump to the target first.
      glideTo(target, clamp(0.35, 1.1, 0.35 + Math.abs(target - el.scrollLeft) / 2200));
      el.classList.remove('is-dragging');
    };

    // The click that ends a drag must not open the card it started on.
    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onDragStart = (event: DragEvent) => event.preventDefault();

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    // On window: a press released outside the rail must still end.
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('wheel', stopGlide, { passive: true });
    el.addEventListener('touchstart', stopGlide, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('dragstart', onDragStart);
      el.removeEventListener('wheel', stopGlide);
      el.removeEventListener('touchstart', stopGlide);
      stopGlide();
    };
  }, [ref, glideTo, stopGlide]);

  return { page };
};
