import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { MenuItem } from '../types';
import { useDragScroll } from '../hooks/useDragScroll';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { MenuCardSkeleton } from './Skeletons';

interface MenuCarouselProps {
  items: MenuItem[];
  isLoading: boolean;
  /** Changing it rewinds the rail and deals the cards in again (category switch). */
  dealKey: string;
  renderCard: (item: MenuItem) => React.ReactNode;
}

const SLIDE = 'shrink-0 w-[min(82vw,21rem)] sm:w-[21rem] lg:w-[23rem]';
const ARROW =
  'menu-rail-arrow inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#36312f] bg-[#161413] text-[#f5f3f0] transition-colors hover:border-[#e11d48] hover:bg-[#e11d48] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]';

export const MenuCarousel: React.FC<MenuCarouselProps> = ({ items, isLoading, dealKey, renderCard }) => {
  const reducedMotion = usePrefersReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const entered = useInView(railRef, { once: true, amount: 0.2 });
  const { page } = useDragScroll(railRef, { inertia: !reducedMotion });

  useEffect(() => {
    railRef.current?.scrollTo({ left: 0 });
  }, [dealKey]);

  // Progress thumb, arrow states and the photo drift follow the rail's scroll without re-rendering.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const progress = max > 0 ? rail.scrollLeft / max : 0;
      const visible = rail.scrollWidth > 0 ? Math.min(1, rail.clientWidth / rail.scrollWidth) : 1;
      if (thumbRef.current) {
        thumbRef.current.style.width = `${visible * 100}%`;
        thumbRef.current.style.transform = `translateX(${((progress * (1 - visible)) / visible) * 100}%)`;
      }
      prevRef.current?.toggleAttribute('data-disabled', rail.scrollLeft <= 2);
      nextRef.current?.toggleAttribute('data-disabled', rail.scrollLeft >= max - 2);

      if (reducedMotion) return;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      rail.querySelectorAll<HTMLElement>('[data-slide]').forEach((slide) => {
        const media = slide.querySelector<HTMLElement>('[data-card-media]');
        if (!media) return;
        const offset = (slide.offsetLeft + slide.offsetWidth / 2 - center) / rail.clientWidth;
        media.style.transform = `translate3d(${(-Math.max(-1, Math.min(1, offset)) * 6).toFixed(2)}%, 0, 0)`;
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    rail.addEventListener('scroll', schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(rail);
    update();

    return () => {
      rail.removeEventListener('scroll', schedule);
      ro.disconnect();
      cancelAnimationFrame(frame);
      rail.querySelectorAll<HTMLElement>('[data-card-media]').forEach((media) => {
        media.style.transform = '';
      });
    };
  }, [items, isLoading, reducedMotion]);

  return (
    <div>
      <div
        ref={railRef}
        data-lenis-prevent-horizontal
        tabIndex={0}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Carrousel de la carte"
        className="menu-rail flex gap-4 sm:gap-6 overflow-x-auto overscroll-x-contain py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e11d48]/70"
      >
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <div key={`skeleton-${index}`} data-slide className={SLIDE}>
                <MenuCardSkeleton />
              </div>
            ))
          : items.map((item, index) => (
              <motion.div
                key={`${dealKey}-${item.id}`}
                data-slide
                role="group"
                aria-roledescription="plat"
                aria-label={`${index + 1} sur ${items.length} : ${item.name}`}
                className={`${SLIDE} snap-start`}
                initial={{ opacity: 0, x: 56 }}
                animate={entered ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.6, delay: Math.min(index, 5) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderCard(item)}
              </motion.div>
            ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex items-center gap-4 sm:gap-6">
        <p className="hidden sm:flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8f8883]">
          <MoveHorizontal className="w-4 h-4 text-[#e11d48]" aria-hidden="true" />
          Glissez pour explorer
        </p>
        <div aria-hidden="true" className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-[#2e2a28]">
          <span ref={thumbRef} className="absolute inset-y-0 left-0 rounded-full bg-[#e11d48]" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button ref={prevRef} type="button" onClick={() => page(-1)} className={ARROW} aria-label="Plats précédents">
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button ref={nextRef} type="button" onClick={() => page(1)} className={ARROW} aria-label="Plats suivants">
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
