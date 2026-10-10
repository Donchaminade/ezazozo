import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/scroll';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { MenuItem } from '../../types';
import { FireRenderer, type FireState } from './fireRenderer';
import { EmberField, type EmberState } from './emberField';
import { braiseImage, GARNISH, TIMELINE_LENGTH, type GarnishPiece } from './braiseConfig';
import { HeroOrderButton, HeroTitle } from './HeroCopy';

interface BraiseHeroProps {
  signature: MenuItem;
  onOrderSignature: () => void;
}

const DESKTOP_QUERY = '(min-width: 768px)';
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const FINAL_PLATE_RATIO = 607 / 918;
/** The fixed navbar (h-20) plus a little air. */
const HEADER_CLEARANCE = 88;
/** On phones the floating sound widget (bottom-24, 52px tall) sits right where the order button would land. */
const PHONE_WIDGET_CLEARANCE = 164;

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

export const BraiseHero: React.FC<BraiseHeroProps> = ({ signature, onOrderSignature }) => {
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
  const ctaRef = useRef<HTMLDivElement>(null);
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
            fish0: { y: 13, s: 0.82, r: -6 },
            fish1: { y: 0, s: 1, r: -3 },
            sear: { y: 8, s: 1.04 },
            lift: { y: -13, s: 1.06 },
            land: { y: 5 },
            cream: { y: -11, s: 0.84 },
            plateY: 8,
            onPlate: 0.78,
            dishFinal: { y: -5, s: 0.9 },
            fireA: { hw0: 0.38, hw1: 0.47, y: 0.2 },
            fireC: { hw: 0.27, h: 0.5, y: 0.16 },
            emberSpread: 0.8,
          }
        : {
            fish0: { y: 15, s: 0.86, r: -4 },
            fish1: { y: 7, s: 1, r: -3 },
            sear: { y: 11, s: 1.02 },
            lift: { y: -1, s: 1.04 },
            land: { y: 10 },
            cream: { y: -11, s: 0.86 },
            plateY: 4,
            onPlate: 0.78,
            dishFinal: { y: -5, s: 0.9 },
            fireA: { hw0: 0.5, hw1: 0.52, y: 0.14 },
            fireC: { hw: 0.46, h: 0.42, y: 0.12 },
            emberSpread: 1,
          };

      // Final frame: the plate with the order button just under it. Short screens pull both up (and shrink
      // the plate if needed) so the button never lands under the floating widgets.
      const finalFrame = () => {
        const height = stage.clientHeight;
        const plate = dish() * FINAL_PLATE_RATIO;
        const gap = vh(2.5);
        const floor = height - (ctaRef.current?.offsetHeight ?? 0) - (isDesktop ? vh(9) : PHONE_WIDGET_CLEARANCE);
        const scale = Math.min(L.dishFinal.s, (floor - gap - HEADER_CLEARANCE) / plate);
        const center = Math.min(height / 2 + vh(L.plateY + L.dishFinal.y), floor - gap - (plate * scale) / 2);
        return { y: center - height / 2 - vh(L.plateY), scale, cta: center + (plate * scale) / 2 + gap };
      };

      const state = (name: string) => `[data-b="fish-state"][data-state="${name}"]`;
      const [, second, third, fourth] = isDesktop
        ? ['raw', 'seared', 'grilled', 'charred']
        : ['raw', 'grilled', 'charred', 'charred'];

      gsap.set('[data-b="fish-pos"]', { xPercent: -50, yPercent: -50 });
      gsap.set('[data-b="fish-flip"]', { transformPerspective: 1300 });
      gsap.set(['[data-b="garnish"]', '[data-b="sauce"]', '[data-b="final-plate"]'], { xPercent: -50, yPercent: -50 });
      // Squashed so the empty plate shares the perspective of the final plated photo.
      gsap.set('[data-b="plate"]', { xPercent: -50, yPercent: -50, scaleY: 0.89 });
      gsap.set('[data-b="sauce"]', { rotation: -6 });
      gsap.set('[data-b="title-a"]', { transformOrigin: '50% 0%' });
      gsap.set(['[data-b="dish"]', '[data-b="dish-assembly"]'], { transformOrigin: `50% ${50 + L.plateY}%` });

      Object.assign(fireState, { intensity: 0.6, x: 0.5, y: L.fireA.y, halfWidth: L.fireA.hw0, height: 0.3 });
      Object.assign(emberState, { rate: isDesktop ? 30 : 14, x: 0.5, y: 0.87, spread: L.emberSpread, ring: 0, ringAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.set({}, {}, TIMELINE_LENGTH);

      // 1 — La braise: the fish rises over the coals into the headline while the fire builds.
      tl.to('[data-b="scroll-cue"]', { autoAlpha: 0, duration: 16 }, 0)
        .fromTo(
          '[data-b="fish-pos"]',
          { y: () => vh(L.fish0.y), scale: L.fish0.s, rotation: L.fish0.r },
          { y: () => vh(L.fish1.y), scale: L.fish1.s, rotation: L.fish1.r, duration: 55, ease: 'power1.inOut' },
          0
        )
        .to(fireState, { intensity: 0.85, halfWidth: L.fireA.hw1, height: 0.34, duration: 55 }, 0)
        .to(emberState, { rate: isDesktop ? 75 : 26, duration: 55 }, 0);

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

      // Charred finish, then the headline burns off upward (opacity only, so it stays in the accessibility tree).
      tl.to(state(fourth), { autoAlpha: 1, duration: 35 }, 165)
        .to('[data-b="title-a"]', { y: () => -vh(42), opacity: 0, duration: 33, ease: 'power1.in' }, 172)
        .to(emberState, { rate: 0, duration: 25 }, 190)
        .to(fireState, { intensity: 0, duration: 35 }, 205);

      // 3 — Le dressage: the cream panel rises, the plate arrives, sauce, landing, garnish rain.
      tl.fromTo('[data-b="panel-b"]', { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 50, ease: 'power1.inOut' }, 195)
        .to('[data-b="embers"]', { autoAlpha: 0, duration: 14 }, 200)
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

      // 4 — À votre table: the cream panel leaves, the plate settles over the fire, then the order button.
      tl.set(fireState, { y: L.fireC.y, halfWidth: L.fireC.hw, height: L.fireC.h }, 282)
        .set(emberState, { spread: L.emberSpread * 0.55 }, 282)
        .to('[data-b="panel-b"]', { yPercent: -100, duration: 45, ease: 'power1.inOut' }, 292)
        .to('[data-b="embers"]', { autoAlpha: 1, duration: 12 }, 300)
        .to(
          '[data-b="dish"]',
          { y: () => finalFrame().y, scale: () => finalFrame().scale, duration: 42, ease: 'power1.inOut' },
          298
        )
        .to(fireState, { intensity: 1.05, duration: 45 }, 300)
        .to(emberState, { rate: isDesktop ? 55 : 22, duration: 40 }, 300)
        .fromTo('[data-b="final-plate"]', { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 18 }, 330)
        .to('[data-b="dish-assembly"]', { autoAlpha: 0, scaleY: 0.9, duration: 14 }, 336)
        .fromTo(
          '[data-b="cta"]',
          { y: () => finalFrame().cta + vh(3), autoAlpha: 0 },
          { y: () => finalFrame().cta, autoAlpha: 1, duration: 18, ease: 'power2.out' },
          332
        )
        .fromTo('[data-b="outro-fade"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 14 }, 344);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: finePointer ? true : 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          emberState.wind = Math.max(emberState.wind, Math.min(2.2, Math.abs(self.getVelocity()) / 2600));
        },
      });

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
      className="relative h-[380svh] md:h-[460svh] [--dish:90vw] md:[--dish:min(640px,max(46vw,min(72vw,48svh)))] [--plate-y:4svh] md:[--plate-y:8svh]"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[#0b0807] isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_100%,rgba(225,29,72,0.20),transparent_60%),radial-gradient(60%_50%_at_50%_85%,rgba(255,110,30,0.22),transparent_70%)]"
        />

        <HeroTitle className="absolute inset-x-0 top-[21%] md:top-[max(10%,6.5rem)] px-4" />

        {/* Coal bed and flames, drawn over the headline */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4%] md:bottom-[-14%] w-[230vw] md:w-[max(112vw,150svh)]">
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
        </div>

        {/* Cream "dressage" panel slides over the dark stage */}
        <div
          aria-hidden="true"
          data-b="panel-b"
          className="invisible absolute inset-0 bg-[#f3eadb] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,rgba(255,255,255,0.65),transparent_70%)]" />
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

        {/* Melts the coal bed into the next section once the stage stops being pinned */}
        <div
          aria-hidden="true"
          data-b="outro-fade"
          className="invisible pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(to_bottom,transparent,#0b0807)]"
        />

        <div
          aria-hidden="true"
          data-b="scroll-cue"
          className="pointer-events-none absolute bottom-7 left-1/2 h-12 w-px -translate-x-1/2 overflow-hidden bg-[#f3eadb]/20"
        >
          <span className="braise-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,#f3eadb)]" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
          <div ref={ctaRef} data-b="cta" className="invisible pointer-events-auto">
            <HeroOrderButton dishName={signature.name} onClick={onOrderSignature} />
          </div>
        </div>
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
