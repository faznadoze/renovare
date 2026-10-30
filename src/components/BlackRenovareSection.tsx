import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import {
  BLACK_RENOVARE_TREATMENTS,
  buildBlackRenovareMessage,
  buildWhatsAppUrl,
} from '../data/renovareContent';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each copy must outrun the widest viewport so the -50% loop never shows a seam
const TAPE_ITEMS = 14;

// Figma frame 15686: star stickers, positions as % of the 2976 × 1179 banner
const STICKERS = [
  { id: 'top-left', src: './assets/black/e1fd7.svg', starTurn: 4.17, textTurn: 14.12, spin: 12 },
  { id: 'bottom-left', src: './assets/black/2c98a.svg', starTurn: -28.04, textTurn: -18.09, spin: -16 },
  { id: 'right', src: './assets/black/9d7de.svg', starTurn: 1.38, textTurn: 11.33, spin: -10 },
];

// Desktop keeps the frame's two rows (4 + 3); phones let the chips wrap
const TREATMENT_ROWS = [BLACK_RENOVARE_TREATMENTS.slice(0, 4), BLACK_RENOVARE_TREATMENTS.slice(4)];

function Tape({ tone }: { tone: 'olive' | 'black' }) {
  const items = Array.from({ length: TAPE_ITEMS * 2 }, (_, idx) => (
    <span key={idx} className="black-tape__item">
      <span className="black-tape__light">BLACK</span> <span className="black-tape__bold">RENOVARE</span>
    </span>
  ));

  return (
    <div className={`black-tape black-tape--${tone}`} aria-hidden="true">
      <div className="black-tape__track">{items}</div>
    </div>
  );
}

export function BlackRenovareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTreatment = (name: string) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : BLACK_RENOVARE_TREATMENTS.filter((item) => item === name || current.includes(item))
    );
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Campaign tapes run in opposite directions and rest while the section is off screen
        const loops = gsap.utils.toArray<HTMLElement>('.black-tape__track', section).map((track, idx) =>
          gsap.fromTo(
            track,
            { xPercent: idx === 0 ? 0 : -50 },
            { xPercent: idx === 0 ? -50 : 0, duration: 46, ease: 'none', repeat: -1, paused: true }
          )
        );
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.play() : loop.pause())),
        });

        // Entrance, once: wordmark rises out of its mask, the black slab is taped on,
        // stickers are slapped down, then the protocols and the action arrive
        const intro = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: section, start: 'top 68%', once: true },
        });
        intro
          .from('.black-hero__word', { yPercent: 108, duration: 0.95, stagger: 0.09, ease: 'power4.out' })
          .from(
            '.black-hero__slab',
            { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.7, ease: 'power3.inOut' },
            '-=0.5'
          )
          .from(
            '.black-sticker',
            {
              scale: 1.4,
              autoAlpha: 0,
              rotate: (idx: number) => (idx % 2 ? 18 : -18),
              duration: 0.55,
              stagger: 0.12,
              ease: 'back.out(1.6)',
            },
            0.35
          )
          .from('.black-treatments__cell', { y: 18, autoAlpha: 0, duration: 0.5, stagger: 0.05 }, '-=0.45')
          .from('.black-hero__action > *', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, '-=0.3');

        // Stickers turn slowly with the scroll, like labels on a passing box
        gsap.utils.toArray<HTMLElement>('.black-sticker__spin', section).forEach((spin) => {
          gsap.to(spin, {
            rotate: Number(spin.dataset.spin ?? 10),
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const count = selected.length;
  const countLabel =
    count === 0 ? 'Toque nos protocolos que você quer' : `${count} protocolo${count > 1 ? 's' : ''} escolhido${count > 1 ? 's' : ''}`;

  return (
    <section id="black-renovare" ref={sectionRef} className="black-renovare" aria-labelledby="black-renovare-title">
      <div
        className="black-renovare__grain"
        style={{ backgroundImage: 'url(./assets/black/19adf.png)' }}
        aria-hidden="true"
      />

      <div className="black-renovare__tapes">
        <Tape tone="olive" />
        <Tape tone="black" />
      </div>

      {STICKERS.map((sticker) => (
        <div key={sticker.id} className={`black-sticker black-sticker--${sticker.id}`} aria-hidden="true">
          <div className="black-sticker__spin" data-spin={sticker.spin}>
            <div className="black-sticker__star" style={{ transform: `rotate(${sticker.starTurn}deg)` }}>
              <img src={sticker.src} alt="" />
            </div>
            <p className="black-sticker__text" style={{ transform: `translate(-50%, -50%) rotate(${sticker.textTurn}deg)` }}>
              <span>BLACK</span>
              <span>FRIDAY</span>
            </p>
          </div>
        </div>
      ))}

      <div className="black-renovare__inner">
        <div className="black-hero__head">
          <h2 id="black-renovare-title" className="black-hero__title">
            <span className="black-hero__mask">
              <span className="black-hero__word black-hero__word--light">BLACK</span>
            </span>{' '}
            <span className="black-hero__mask">
              <span className="black-hero__word black-hero__word--bold">RENOVARE</span>
            </span>
          </h2>
          <p className="black-hero__slab">
            <span className="black-hero__slab-regular">DESCONTOS EXCLUSIVOS</span>
            <span className="black-hero__slab-bold"> SOMENTE </span>
            <span className="black-hero__slab-extra">NA BLACK 2026</span>
          </p>
        </div>

        <div className="black-treatments" role="group" aria-label="Protocolos com condição Black">
          {TREATMENT_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="black-treatments__row">
              {row.map((name, idx) => {
                const isOn = selected.includes(name);
                return (
                  <span key={name} className="black-treatments__cell">
                    {idx > 0 && (
                      <img className="black-treatments__dot" src="./assets/black/8ee66.svg" alt="" aria-hidden="true" />
                    )}
                    <button
                      type="button"
                      className={`black-treatment ${isOn ? 'is-on' : ''}`}
                      aria-pressed={isOn}
                      onClick={() => toggleTreatment(name)}
                    >
                      <span className="black-treatment__label">{name}</span>
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <div className="black-hero__action">
          <p className="black-hero__count" aria-live="polite">
            {countLabel}
          </p>
          <a
            href={buildWhatsAppUrl(buildBlackRenovareMessage(selected))}
            target="_blank"
            rel="noopener noreferrer"
            className="celimax-btn-cta black-hero__cta"
          >
            <span>{count ? 'Garantir minha condição Black' : 'Quero minha condição Black'}</span>
            <span className="celimax-btn-arrow-circle" aria-hidden="true">
              <ArrowUpRight size={22} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
