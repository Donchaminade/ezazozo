import React, { useRef } from 'react';
import { Flame } from 'lucide-react';
import { gsap, scrubAmount, useGSAP } from '../lib/scroll';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/** Giant rows drift in opposite directions; `from`/`to` are horizontal offsets in vw. */
const ROWS = [
  { words: ['Braise', 'Dorade royale', 'Alloco', 'Piment noir', 'Capitaine', 'Attiéké'], outline: false, from: -4, to: -46 },
  { words: ["Feu d'acacia", 'Bè-Plage', 'Pêche du jour', 'Lomé', 'Marinade 12 h'], outline: true, from: -46, to: -4 },
];

const MANIFESTO: { text: string; accent?: boolean }[] = [
  { text: "Pêché à l'aube au port de Lomé." },
  { text: 'Mariné douze heures.' },
  { text: 'Saisi sur la' },
  { text: "braise d'acacia,", accent: true },
  { text: 'retourné une seule fois.' },
  { text: 'Servi' },
  { text: 'brûlant,', accent: true },
  { text: 'rien que pour vous.' },
];

const MANIFESTO_TEXT = MANIFESTO.map((part) => part.text).join(' ');
const MANIFESTO_WORDS = MANIFESTO.flatMap(({ text, accent }) => text.split(' ').map((word) => ({ word, accent })));

/** Interlude between the hero and the story: parallax typography and a manifesto that lights up word by word. */
export const FireInterlude: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const scrub = scrubAmount();
      const vw = (n: number) => (window.innerWidth * n) / 100;

      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row, i) => {
        const { from, to } = ROWS[i];
        gsap.fromTo(
          row,
          { x: () => vw(from) },
          {
            x: () => vw(to),
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true },
          }
        );
      });

      gsap.fromTo(
        '[data-word]',
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-manifesto]', start: 'top 85%', end: 'bottom 55%', scrub },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <section ref={sectionRef} aria-label="Le rituel Eza Zozo" className="relative overflow-hidden bg-[#0b0807] py-16 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_45%_at_50%_0%,rgba(225,29,72,0.16),transparent_70%),radial-gradient(60%_40%_at_50%_100%,rgba(255,110,30,0.08),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,#000_28%)]"
      />

      <div
        aria-hidden="true"
        className="relative select-none font-display font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-[15vw] md:text-[9vw]"
      >
        {ROWS.map((row, i) => (
          <div
            key={i}
            data-row
            className={`flex w-max whitespace-nowrap will-change-transform ${row.outline ? 'text-outline-ember' : 'text-[#f3eadb]'}`}
            style={{ transform: `translateX(${row.from}vw)` }}
          >
            {row.words.map((word) => (
              <span key={word} className="flex items-center">
                {word}
                <Flame className="mx-[0.28em] h-[0.4em] w-[0.4em] shrink-0 text-[#e11d48]" fill="currentColor" strokeWidth={1.5} />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-14 md:mt-20 max-w-5xl px-6 text-center">
        <div className="mb-5 text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-[#fda4af]">
          Le rituel Eza Zozo
        </div>
        <p
          data-manifesto
          className="font-display font-bold text-[1.65rem] leading-[1.12] md:text-[clamp(2.2rem,4vw,3.6rem)] tracking-[-0.02em] text-[#f3eadb] text-balance"
        >
          <span className="sr-only">{MANIFESTO_TEXT}</span>
          <span aria-hidden="true">
            {MANIFESTO_WORDS.map(({ word, accent }, i) => (
              <React.Fragment key={i}>
                <span data-word className={`inline-block ${accent ? 'text-[#e11d48]' : ''}`}>
                  {word}
                </span>{' '}
              </React.Fragment>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
};
