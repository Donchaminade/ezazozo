import React, { useEffect, useRef, useState } from 'react';
import { Phone, ShoppingBag } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/scroll';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { formatPrice } from '../../data/restaurantData';
import type { MenuItem } from '../../types';
import { FireRenderer, type FireState } from './fireRenderer';
import { EmberField, type EmberState } from './emberField';
import { braiseImage, CHAPTERS, GARNISH, TIMELINE_LENGTH, type GarnishPiece } from './braiseConfig';

interface BraiseHeroProps {
  children: React.ReactNode;
  signature: MenuItem;
  onOrderSignature: () => void;
}

const DESKTOP_QUERY = '(min-width: 768px)';
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** Loads the images needed after the first screen once the page is idle (or on first scroll). */
const useDeferredAssets = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const go = () => setReady(true);
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(go, { timeout: 1500 });
      else timeoutId = window.setTimeout(go, 500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    window.addEventListener('scroll', go, { once: true, passive: true });
    return () => {
      window.removeEventListener('load', schedule);
      window.removeEventListener('scroll', go);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);
  return ready;
};

export const BraiseHero: React.FC<BraiseHeroProps> = ({ children, signature, onOrderSignature }) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const deferredReady = useDeferredAssets();
  const small = !isDesktop;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fireCanvasRef = useRef<HTMLCanvasElement>(null);
  const emberCanvasRef = useRef<HTMLCanvasElement>(null);
  const fishRef = useRef<HTMLDivElement>(null);
  const fishTiltRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const chapterLabelRef = useRef<HTMLSpanElement>(null);
  const emberFieldRef = useRef<EmberField | null>(null);
  const [fireFallback, setFireFallback] = useState(false);

  const fireState = useRef<FireState>({ intensity: 0, x: 0.5, y: 0.13, halfWidth: 0.45, height: 0.3 }).current;
  const emberState = useRef<EmberState>({
    rate: 0,
    x: 0.5,
    y: 0.86,
    spread: 0.8,
    wind: 0,
    ring: 0,
    ringAlpha: 0,
  }).current;

  const fishStates = isDesktop ? ['raw', 'seared', 'grilled', 'charred'] : ['raw', 'grilled', 'charred'];
  const garnish = GARNISH.filter((piece) => isDesktop || piece.mobile);
  const signatureWhatsApp = `https://wa.me/22890123456?text=${encodeURIComponent(
    `Bonjour Eza Zozo, je veux commander le feu : *${signature.name}* (${formatPrice(signature.price)}). C'est disponible ?`
  )}`;

  // Canvas layers: one GSAP ticker callback renders flames and embers while the hero is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    const fireCanvas = fireCanvasRef.current;
    const emberCanvas = emberCanvasRef.current;
    if (!section || !fireCanvas || !emberCanvas) return;

    const fire = FireRenderer.create(fireCanvas, fireState, isDesktop ? 0.5 : 0.36);
    setFireFallback(!fire);
    const onContextLost = () => setFireFallback(true);
    fireCanvas.addEventListener('webglcontextlost', onContextLost);
    let embers: EmberField | null = null;
    try {
      embers = new EmberField(emberCanvas, emberState, isDesktop ? 190 : 60, isDesktop ? 1.5 : 1.25);
    } catch {
      embers = null;
    }
    emberFieldRef.current = embers;

    let visible = false;
    let frame = 0;
    const tick = (time: number) => {
      frame++;
      emberState.wind *= 0.9;
      if (embers) {
        const fish = fishTiltRef.current;
        if (fish && emberState.ring > 0.001) {
          const stageBox = emberCanvas.getBoundingClientRect();
          const box = fish.getBoundingClientRect();
          embers.setRingGeometry({
            cx: box.left - stageBox.left + box.width / 2,
            cy: box.top - stageBox.top + box.height * 0.55,
            rx: box.width * 0.62,
            ry: box.height * 0.62,
          });
        }
        embers.render(time);
      }
      // Phones render the shader every other frame; the flames are soft enough to hide it.
      if (fire && (isDesktop || frame % 2 === 0)) fire.render(time);
    };

    const setVisible = (next: boolean) => {
      if (next === visible) return;
      visible = next;
      if (visible) gsap.ticker.add(tick);
      else {
        gsap.ticker.remove(tick);
        embers?.clear();
      }
    };

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    io.observe(section);
    const ro = new ResizeObserver(() => {
      fire?.resize();
      embers?.resize();
    });
    ro.observe(fireCanvas);

    return () => {
      io.disconnect();
      ro.disconnect();
      fireCanvas.removeEventListener('webglcontextlost', onContextLost);
      gsap.ticker.remove(tick);
      fire?.destroy();
      emberFieldRef.current = null;
    };
  }, [isDesktop, fireState, emberState]);

  // Cursor tilt on the fish plus a little counter-parallax on the backdrop (mouse/trackpad only).
  useGSAP(
    () => {
      const tilt = fishTiltRef.current;
      if (!tilt) return;
      gsap.set(tilt, { transformPerspective: 900 });
      if (!finePointer || !isDesktop) return;

      const rotY = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      const rotX = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const tx = gsap.quickTo(tilt, 'x', { duration: 1.1, ease: 'power3.out' });
      const ty = gsap.quickTo(tilt, 'y', { duration: 1.1, ease: 'power3.out' });
      const titleX = gsap.quickTo('[data-b="title-a-inner"]', 'x', { duration: 1.4, ease: 'power3.out' });
      const coalsX = gsap.quickTo('[data-b="coals"]', 'x', { duration: 1.6, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const box = tilt.getBoundingClientRect();
        const nx = gsap.utils.clamp(-1, 1, (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2));
        const ny = gsap.utils.clamp(-1, 1, (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2));
        rotY(nx * 16);
        rotX(-ny * 10);
        tx(nx * 22);
        ty(ny * 14);
        titleX(-nx * 18);
        coalsX(-nx * 10);
      };
      const onLeave = () => {
        rotY(0);
        rotX(0);
        tx(0);
        ty(0);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      return () => {
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: sectionRef, dependencies: [finePointer, isDesktop], revertOnUpdate: true }
  );

  // The scroll-scrubbed film: one timeline whose units map to the pinned scroll distance.
  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const fish = fishRef.current;
      if (!section || !stage || !fish) return;

      const vw = (n: number) => (window.innerWidth * n) / 100;
      const vh = (n: number) => (stage.clientHeight * n) / 100;
      const dish = () => fish.offsetWidth;

      const L = isDesktop
        ? {
            fish0: { x: 18, y: 8, s: 0.72, r: -6 },
            fish1: { x: 0, y: 0, s: 1, r: -3 },
            sear: { y: 8, s: 1.04 },
            lift: { y: -13, s: 1.06 },
            land: { y: 5 },
            cream: { y: -11, s: 0.84 },
            plateY: 8,
            onPlate: 0.78,
            dishFinal: { x: -17, y: 4, s: 0.94 },
            fireA: { x0: 0.62, hw0: 0.34, x1: 0.5, hw1: 0.47, y: 0.2 },
            fireC: { x: 0.33, hw: 0.25, h: 0.6, y: 0.18 },
            emberSpread: 0.8,
          }
        : {
            fish0: { x: 0, y: 64, s: 0.92, r: -4 },
            fish1: { x: 0, y: 7, s: 1, r: -3 },
            sear: { y: 11, s: 1.02 },
            lift: { y: -1, s: 1.04 },
            land: { y: 10 },
            cream: { y: -11, s: 0.86 },
            plateY: 4,
            onPlate: 0.78,
            dishFinal: { x: 0, y: -16, s: 0.78 },
            fireA: { x0: 0.5, hw0: 0.5, x1: 0.5, hw1: 0.52, y: 0.14 },
            fireC: { x: 0.5, hw: 0.46, h: 0.42, y: 0.12 },
            emberSpread: 1,
          };

      const state = (name: string) => `[data-b="fish-state"][data-state="${name}"]`;
      const [, second, third, fourth] = isDesktop
        ? ['raw', 'seared', 'grilled', 'charred']
        : ['raw', 'grilled', 'charred', 'charred'];
      const setProgress = gsap.quickSetter(section.querySelector('[data-b="progress"]'), 'scaleX');

      gsap.set('[data-b="fish-pos"]', { xPercent: -50, yPercent: -50 });
      gsap.set('[data-b="fish-flip"]', { transformPerspective: 1300 });
      gsap.set(['[data-b="garnish"]', '[data-b="sauce"]', '[data-b="final-plate"]'], { xPercent: -50, yPercent: -50 });
      // Squashed so the empty plate shares the perspective of the final plated photo.
      gsap.set('[data-b="plate"]', { xPercent: -50, yPercent: -50, scaleY: 0.89 });
      gsap.set('[data-b="sauce"]', { rotation: -6 });
      gsap.set('[data-b="title-a"]', { transformOrigin: '50% 0%' });
      gsap.set(['[data-b="dish"]', '[data-b="dish-assembly"]'], { transformOrigin: `50% ${50 + L.plateY}%` });

      Object.assign(fireState, { intensity: 0.5, x: L.fireA.x0, y: L.fireA.y, halfWidth: L.fireA.hw0, height: 0.28 });
      Object.assign(emberState, { rate: isDesktop ? 26 : 12, x: L.fireA.x0, y: 0.87, spread: L.emberSpread, ring: 0, ringAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.set({}, {}, TIMELINE_LENGTH);

      // 1 — La braise: the copy leaves, the fish glides over the coals, the headline rises.
      tl.to('[data-b="copy"]', { y: () => -vh(14), autoAlpha: 0, duration: 32, ease: 'power1.in' }, 0)
        .to('[data-b="scrim"]', { autoAlpha: 0, duration: 45 }, 0)
        .to('[data-b="scroll-cue"]', { autoAlpha: 0, duration: 16 }, 0)
        .fromTo(['[data-b="side-label"]', '[data-b="mobile-progress"]'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 20 }, 26)
        .fromTo(
          '[data-b="fish-pos"]',
          { x: () => vw(L.fish0.x), y: () => vh(L.fish0.y), scale: L.fish0.s, rotation: L.fish0.r },
          { x: () => vw(L.fish1.x), y: () => vh(L.fish1.y), scale: L.fish1.s, rotation: L.fish1.r, duration: 55, ease: 'power1.inOut' },
          0
        )
        .fromTo(
          '[data-b="title-a"]',
          { y: () => vh(34), autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 42, ease: 'power2.out' },
          20
        )
        .fromTo('[data-b="kicker-a"]', { y: () => vh(10), autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 28 }, 32)
        .to(fireState, { intensity: 0.85, x: L.fireA.x1, halfWidth: L.fireA.hw1, height: 0.34, duration: 55 }, 0)
        .to(emberState, { rate: isDesktop ? 75 : 26, x: L.fireA.x1, duration: 55 }, 0);

      // Saisie: closer to the coals, the flames burst, a ring of fire wraps the fish.
      tl.to('[data-b="fish-pos"]', { y: () => vh(L.sear.y), scale: L.sear.s, rotation: 0, duration: 45, ease: 'power1.inOut' }, 55)
        .to(state(second), { autoAlpha: 1, duration: 50 }, 55)
        .to(fireState, { intensity: 1.35, height: 0.44, duration: 35, ease: 'power2.out' }, 60)
        .to('[data-b="title-a"]', { scale: 1.035, duration: 95 }, 58)
        .set(emberState, { ringAlpha: 1 }, 67.9)
        .to(emberState, { ring: 1, duration: 46, ease: 'power1.inOut' }, 68)
        .to(emberState, { ringAlpha: 0, duration: 16 }, 112);

      // 2 — Le retournement: lift, flip on the Y axis, swap the cooked side, drop back with sparks.
      tl.to('[data-b="fish-pos"]', { y: () => vh(L.lift.y), scale: L.lift.s, rotation: 5, duration: 18, ease: 'power2.out' }, 110)
        .to('[data-b="fish-flip"]', { rotationY: 180, duration: 32, ease: 'power1.inOut' }, 114)
        .to(state(third), { autoAlpha: 1, duration: 7 }, 127)
        .to('[data-b="fish-pos"]', { y: () => vh(L.land.y), rotation: -2, scale: 1.02, duration: 24, ease: 'power2.in' }, 134)
        .to(fireState, { intensity: 0.95, height: 0.36, duration: 18 }, 110)
        .to(fireState, { intensity: 1.45, height: 0.48, duration: 10, ease: 'power2.out' }, 152)
        .to(fireState, { intensity: 1.1, height: 0.4, duration: 25 }, 162)
        .to(emberState, { rate: isDesktop ? 90 : 34, duration: 50 }, 105)
        .call(
          () => {
            const box = fish.getBoundingClientRect();
            const stageBox = stage.getBoundingClientRect();
            emberFieldRef.current?.burst(
              isDesktop ? 70 : 28,
              box.left - stageBox.left + box.width / 2,
              box.top - stageBox.top + box.height * 0.8,
              box.width * 0.8
            );
          },
          undefined,
          158
        );

      // Charred finish, then the first headline burns off upward.
      tl.to(state(fourth), { autoAlpha: 1, duration: 35 }, 165)
        .to('[data-b="title-a"]', { y: () => -vh(42), autoAlpha: 0, duration: 33, ease: 'power1.in' }, 172)
        .to('[data-b="kicker-a"]', { autoAlpha: 0, duration: 20 }, 172)
        .to(emberState, { rate: 0, duration: 25 }, 190)
        .to(fireState, { intensity: 0, duration: 35 }, 205);

      // 3 — Le dressage: the cream panel rises, the plate arrives, sauce, landing, garnish rain.
      tl.fromTo('[data-b="panel-b"]', { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 50, ease: 'power1.inOut' }, 195)
        .to('[data-b="embers"]', { autoAlpha: 0, duration: 14 }, 200)
        .to('[data-b="ui"]', { '--ui-ink': '#1a1210', duration: 14 }, 226)
        .fromTo('[data-b="title-b"]', { y: () => vh(26) }, { y: 0, duration: 55, ease: 'power1.out' }, 195)
        .to('[data-b="title-b"]', { y: () => -vh(isDesktop ? 3.5 : 7), duration: 45 }, 250)
        .to('[data-b="fish-pos"]', { y: () => vh(L.cream.y), scale: L.cream.s, rotation: 0, duration: 45, ease: 'power1.inOut' }, 195)
        .fromTo(
          '[data-b="plate"]',
          { y: () => vh(70), autoAlpha: 1 },
          { y: 0, duration: 40, ease: 'power2.out' },
          215
        )
        .fromTo(
          '[data-b="sauce"]',
          { clipPath: 'inset(0% 100% 0% 0%)', autoAlpha: 1, scaleX: 0.9 },
          { clipPath: 'inset(0% 0% 0% 0%)', scaleX: 1, duration: 22, ease: 'power2.out' },
          240
        )
        .to(
          '[data-b="fish-pos"]',
          {
            y: () => vh(L.plateY) - dish() * 0.03,
            scale: L.onPlate,
            scaleY: L.onPlate * 0.84,
            rotation: -3,
            duration: 20,
            ease: 'power2.in',
          },
          252
        )
        .fromTo('[data-b="fish-shadow"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 10 }, 262);

      gsap.utils.toArray<HTMLElement>('[data-b="garnish"]').forEach((piece, i) => {
        const spin = Number(piece.dataset.rotate ?? 0);
        tl.fromTo(
          piece,
          {
            y: () => -vh(78) - (i % 4) * vh(6),
            x: () => (i % 2 ? 1 : -1) * vw(3 + (i % 3) * 2),
            rotation: spin + (i % 2 ? 160 : -140),
            autoAlpha: 1,
          },
          { y: 0, x: 0, rotation: spin, duration: 16, ease: 'power2.in' },
          262 + i * 1.6
        );
      });

      // 4 — À votre table: the cream panel leaves upward over the reset dark stage.
      tl.set('[data-b="title-c"]', { autoAlpha: 1 }, 282)
        .set(fireState, { x: L.fireC.x, y: L.fireC.y, halfWidth: L.fireC.hw, height: L.fireC.h }, 282)
        .set(emberState, { x: L.fireC.x, spread: L.emberSpread * 0.55 }, 282)
        .to('[data-b="panel-b"]', { yPercent: -100, duration: 45, ease: 'power1.inOut' }, 292)
        .to('[data-b="embers"]', { autoAlpha: 1, duration: 12 }, 300)
        .to('[data-b="ui"]', { '--ui-ink': '#f5f3f0', duration: 14 }, 306)
        .fromTo('[data-b="title-c-inner"]', { y: () => vh(40) }, { y: 0, duration: 50, ease: 'power2.out' }, 292)
        .to(
          '[data-b="dish"]',
          { x: () => vw(L.dishFinal.x), y: () => vh(L.dishFinal.y), scale: L.dishFinal.s, duration: 42, ease: 'power1.inOut' },
          298
        )
        .to(fireState, { intensity: 1.05, duration: 45 }, 300)
        .to(emberState, { rate: isDesktop ? 55 : 22, duration: 40 }, 300)
        .fromTo('[data-b="final-plate"]', { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 18 }, 330)
        .to('[data-b="dish-assembly"]', { autoAlpha: 0, scaleY: 0.9, duration: 14 }, 336)
        .to('[data-b="rail"]', { autoAlpha: 0, duration: 12 }, 330)
        .fromTo(
          '[data-b="ticket"]',
          { autoAlpha: 0, x: () => (isDesktop ? vw(6) : 0), y: () => (isDesktop ? 0 : vh(8)), rotation: isDesktop ? 6 : 0 },
          { autoAlpha: 1, x: 0, y: 0, rotation: isDesktop ? 2 : 0, duration: 20, ease: 'power2.out' },
          334
        );

      let chapter = -1;
      const updateChapter = () => {
        const time = tl.time();
        let next = 0;
        CHAPTERS.forEach((c, i) => {
          if (time >= c.start) next = i;
        });
        if (next === chapter) return;
        chapter = next;
        railRef.current?.querySelectorAll('li').forEach((li, i) => li.toggleAttribute('data-active', i === next));
        if (chapterLabelRef.current) {
          chapterLabelRef.current.textContent = `0${next + 1} · ${CHAPTERS[next].label}`;
        }
      };

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: finePointer ? true : 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          emberState.wind = Math.max(emberState.wind, Math.min(2.2, Math.abs(self.getVelocity()) / 2600));
          setProgress(self.progress);
          updateChapter();
        },
        onRefresh: updateChapter,
      });
      updateChapter();

      gsap.to('[data-b="fish-bob"]', {
        y: isDesktop ? 9 : 6,
        rotation: 1.2,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: sectionRef, dependencies: [isDesktop, finePointer], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      id="accueil"
      className="relative h-[380svh] md:h-[460svh] [--dish:90vw] md:[--dish:min(46vw,640px)] [--plate-y:4svh] md:[--plate-y:8svh]"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[#0b0807] isolate">
        {/* Base: dark stage, giant headline, coal bed, flames and embers */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_100%,rgba(225,29,72,0.20),transparent_60%),radial-gradient(60%_50%_at_50%_85%,rgba(255,110,30,0.22),transparent_70%)]" />

          <div data-b="title-a" className="invisible absolute inset-x-0 top-[15%] md:top-[max(10%,6.5rem)] text-center">
            <div data-b="kicker-a" className="mb-3 md:mb-4 text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-[#fda4af]">
              Braise d'acacia · Lomé
            </div>
            <div
              data-b="title-a-inner"
              className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-[#f3eadb] text-[12.5vw] md:text-[min(10vw,16svh)] braise-title-glow"
            >
              <span className="block">Né dans</span>
              <span className="block">le feu</span>
            </div>
            <p className="mt-4 text-sm font-medium text-[#c4bfb9] md:hidden">Vraie braise. Saveur sauvage.</p>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4%] md:bottom-[-14%] w-[230vw] md:w-[112vw]">
            <img
              data-b="coals"
              src={braiseImage('coals', small)}
              alt=""
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="block w-full max-w-none braise-coals select-none"
            />
          </div>

          <div
            data-b="fire-fallback"
            className={`absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(255,120,30,0.45),transparent_70%)] animate-glow ${fireFallback ? '' : 'hidden'}`}
          />
          <canvas ref={fireCanvasRef} data-b="fire" className="absolute inset-0 h-full w-full mix-blend-screen" />

          <div data-b="title-c" className="invisible absolute inset-x-0 top-[13%] md:top-[15%] px-5 md:px-[6vw]">
            <div data-b="title-c-inner" className="text-center md:text-left">
              <div className="mb-3 text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-[#fda4af]">
                Servi brûlant · Rien que pour vous
              </div>
              <div className="font-display font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-[#f3eadb] text-[7vw] md:text-[min(4.6vw,9svh)]">
                Tout le feu.
                <br />
                <span className="text-[#e11d48]">À votre table.</span>
              </div>
              <p className="hidden md:block mt-4 max-w-sm text-sm text-[#c4bfb9] leading-relaxed">
                Pêché le matin au port de Lomé, braisé le soir au feu d'acacia. Livré encore fumant.
              </p>
            </div>
          </div>

          <div
            data-b="scrim"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,8,7,0.92)_0%,rgba(11,8,7,0.78)_55%,rgba(11,8,7,0)_88%)] md:bg-[linear-gradient(90deg,rgba(11,8,7,0.94)_0%,rgba(11,8,7,0.72)_42%,rgba(11,8,7,0)_68%)]"
          />
        </div>

        {/* Cream "dressage" panel slides over the dark stage */}
        <div
          aria-hidden="true"
          data-b="panel-b"
          className="invisible absolute inset-0 bg-[#f3eadb] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,rgba(255,255,255,0.65),transparent_70%)]" />
          <div data-b="title-b" className="absolute inset-x-0 top-[17%] md:top-[max(12%,7.5rem)] text-center">
            <div className="mb-3 text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-[#be123c]">
              Libérez les saveurs
            </div>
            <div className="font-display font-extrabold uppercase leading-[0.84] tracking-[-0.05em] text-[#1a1210] text-[11vw] md:text-[min(9.6vw,15svh)]">
              Laissez
              <br />
              pleuvoir
            </div>
          </div>
        </div>

        {/* The dish: plate, sauce, garnish and the fish travel together */}
        <div aria-hidden="true" data-b="dish" className="absolute inset-0 pointer-events-none">
          <div data-b="dish-assembly" className="absolute inset-0">
            <img
              data-b="plate"
              src={deferredReady ? braiseImage('plate', small) : undefined}
              alt=""
              decoding="async"
              draggable={false}
              className="invisible absolute left-1/2 top-[calc(50%_+_var(--plate-y))] w-[calc(var(--dish)*0.98)] aspect-[721/506] select-none"
            />
            <img
              data-b="sauce"
              src={deferredReady ? braiseImage('sauce', small) : undefined}
              alt=""
              decoding="async"
              draggable={false}
              className="invisible absolute left-1/2 top-[calc(50%_+_var(--plate-y)_+_var(--dish)*0.07)] w-[calc(var(--dish)*0.78)] aspect-[1000/324] select-none"
            />
            {garnish
              .filter((piece) => !piece.front)
              .map((piece) => (
                <GarnishSprite key={piece.name} piece={piece} src={deferredReady ? braiseImage(`garnish-${piece.name}`, false) : undefined} />
              ))}
            <div
              data-b="fish-shadow"
              className="invisible absolute left-1/2 top-[calc(50%_+_var(--plate-y)_+_var(--dish)*0.05)] h-[calc(var(--dish)*0.16)] w-[calc(var(--dish)*0.7)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/45 blur-xl"
            />

            <div ref={fishRef} data-b="fish-pos" className="absolute left-1/2 top-1/2 w-[var(--dish)] will-change-transform">
              <div data-b="fish-bob">
                <div ref={fishTiltRef} data-b="fish-tilt">
                  <div data-b="fish-flip" className="relative aspect-[1036/440]">
                    <div className="absolute inset-[18%_8%_-6%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,110,30,0.28),transparent)] blur-2xl" />
                    {fishStates.map((name, i) => (
                      <img
                        key={name}
                        data-b="fish-state"
                        data-state={name}
                        src={i < 2 || deferredReady ? braiseImage(`fish-${name}`, small) : undefined}
                        alt=""
                        fetchPriority={i === 0 ? 'high' : undefined}
                        decoding="async"
                        draggable={false}
                        className={`absolute inset-0 h-full w-full select-none ${i === 0 ? '' : 'invisible opacity-0'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {garnish
              .filter((piece) => piece.front)
              .map((piece) => (
                <GarnishSprite key={piece.name} piece={piece} src={deferredReady ? braiseImage(`garnish-${piece.name}`, false) : undefined} />
              ))}
          </div>

          <img
            data-b="final-plate"
            src={deferredReady ? braiseImage('final-plate', small) : undefined}
            alt=""
            decoding="async"
            draggable={false}
            className="invisible absolute left-1/2 top-[calc(50%_+_var(--plate-y))] w-[var(--dish)] aspect-[918/607] select-none"
          />
        </div>

        <canvas
          ref={emberCanvasRef}
          aria-hidden="true"
          data-b="embers"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Chapter rail, side label and progress */}
        <div aria-hidden="true" data-b="ui" className="braise-ui pointer-events-none absolute inset-0">
          <div
            data-b="side-label"
            className="braise-ui-muted invisible hidden md:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-180 [writing-mode:vertical-rl] text-[10px] font-semibold uppercase tracking-[0.4em]"
          >
            Lomé · Bè-Plage · Feu de bois d'acacia
          </div>
          <div data-b="rail" className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-end gap-8">
            <ol ref={railRef} className="flex flex-col gap-4 text-right braise-rail">
              {CHAPTERS.map((chapter, i) => (
                <li key={chapter.label} className="flex items-center justify-end gap-3">
                  <span className="braise-rail-label text-[10px] font-semibold uppercase tracking-[0.25em]">
                    0{i + 1} · {chapter.label}
                  </span>
                  <span className="braise-rail-dot h-1.5 w-1.5 rounded-full" />
                </li>
              ))}
            </ol>
            <div data-b="scroll-cue" className="flex items-center gap-3 pr-[2.5px]">
              <span className="braise-ui-muted text-[10px] font-semibold uppercase tracking-[0.25em]">Défilez</span>
              <span className="relative h-10 w-px overflow-hidden bg-[color-mix(in_srgb,var(--ui-ink)_14%,transparent)]">
                <span className="braise-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-[#e11d48]" />
              </span>
            </div>
          </div>
          <div data-b="mobile-progress" className="invisible md:hidden absolute left-4 right-28 bottom-6 flex items-center gap-3">
            <span ref={chapterLabelRef} className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ui-ink)]">
              01 · La braise
            </span>
            <span className="relative h-px flex-1 bg-[color-mix(in_srgb,var(--ui-ink)_18%,transparent)] overflow-hidden">
              <span data-b="progress" className="absolute inset-0 origin-left scale-x-0 bg-[#e11d48]" />
            </span>
          </div>
        </div>

        {/* Final call to action ticket */}
        <div className="pointer-events-none absolute z-20 left-1/2 -translate-x-1/2 bottom-[21%] w-[min(88vw,22rem)] md:left-auto md:translate-x-0 md:right-[7vw] md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[19rem]">
          <div data-b="ticket" className="invisible pointer-events-auto braise-ticket bg-[#f3eadb] text-[#1a1210] px-5 py-5 md:px-6 md:py-7">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#be123c]">Signature Eza Zozo</div>
            <p className="mt-2 font-display text-lg md:text-[1.5rem] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              Votre prochaine obsession
            </p>
            <p className="mt-3 hidden md:block text-xs leading-relaxed text-[#5c4f47]">
              {signature.name} : marinade 12 h, braise d'acacia, alloco doré, oignons et piment frais.
            </p>
            <div className="mt-3 md:mt-4 border-t border-dashed border-[#1a1210]/25 pt-3">
              <div className="text-[10px] uppercase tracking-widest text-[#7a6b62]">
                Dorade royale · {signature.portion}
              </div>
              <div className="mt-0.5 whitespace-nowrap font-display text-xl md:text-2xl font-extrabold tabular-nums">
                {formatPrice(signature.price)}
              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={onOrderSignature}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#e11d48] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e11d48]/30 transition-colors hover:bg-[#be123c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1210] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3eadb] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Commandez le feu</span>
              </button>
              <a
                href={signatureWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1a1210]/20 text-[#128c4a] transition-colors hover:bg-[#1a1210]/5"
                aria-label={`Commander ${signature.name} sur WhatsApp`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* First screen: the original hero copy, scrolling over the stage */}
      <div data-b="copy" className="absolute inset-x-0 top-0 z-10">
        {children}
      </div>
    </section>
  );
};

const GarnishSprite: React.FC<{ piece: GarnishPiece; src?: string }> = ({ piece, src }) => (
  <img
    data-b="garnish"
    data-rotate={piece.rotate}
    src={src}
    alt=""
    decoding="async"
    draggable={false}
    className="invisible absolute select-none"
    style={{
      left: `calc(50% + var(--dish) * ${piece.x})`,
      top: `calc(50% + var(--plate-y) + var(--dish) * ${piece.y})`,
      width: `calc(var(--dish) * ${piece.size})`,
    }}
  />
);
