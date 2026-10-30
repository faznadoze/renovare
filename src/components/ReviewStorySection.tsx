import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { ReviewRatingCard } from './ReviewRatingCard';
import { GOOGLE_REVIEWS_SHARE_URL, type GoogleReviewItem } from '../data/renovareContent';
import { shouldSmoothScroll, snapThroughLenis } from '../animations/smoothScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The eight petals of the Renovare lily (public/assets/17506.svg), animated one by one
const LILY_PETALS = [
  'M90.6366 0.731705C101.12 11.2279 107.058 24.5302 108.457 38.2057C96.2115 49.3737 87.3907 64.2312 83.7454 81.0315C66.3198 56.8081 68.4929 22.9013 90.2722 1.09756L90.6366 0.731705ZM86.3254 49.7835C82.6932 53.4203 82.339 59.08 85.26 63.1128C86.4878 60.5715 87.8466 58.1054 89.3217 55.7197C89.0459 53.5286 88.0705 51.4073 86.3868 49.722L86.3254 49.7835Z',
  'M152.997 26.8473C152.989 41.6829 147.781 55.2877 139.1 65.9472C122.546 65.1858 105.802 69.4541 91.3449 78.7559C96.1515 49.3056 121.664 26.8673 152.482 26.8496L152.997 26.8473ZM115.267 58.4862C110.126 58.4894 105.874 62.2407 105.088 67.1582C107.753 66.2292 110.458 65.4462 113.188 64.8025C114.541 63.058 115.351 60.8682 115.353 58.4862H115.267Z',
  'M178.627 89.4124C168.131 99.8963 154.829 105.833 141.154 107.232C129.985 94.9873 115.127 86.168 98.3261 82.5227C122.549 65.0959 156.457 67.2688 178.261 89.048L178.627 89.4124ZM129.576 85.1012C125.939 81.469 120.279 81.1149 116.246 84.0366C118.788 85.2637 121.253 86.6224 123.64 88.0983C125.83 87.8217 127.951 86.8463 129.637 85.1627L129.576 85.1012Z',
  'M152.51 151.774C137.675 151.766 124.071 146.557 113.412 137.876C114.173 121.321 109.903 104.579 100.602 90.1222C130.052 94.9288 152.491 120.44 152.509 151.258L152.51 151.774ZM120.874 114.041C120.871 108.901 117.119 104.649 112.201 103.863C113.131 106.528 113.914 109.232 114.558 111.962C116.302 113.317 118.492 114.127 120.874 114.128V114.041Z',
  'M89.9466 177.403C79.4627 166.907 73.5263 153.604 72.1273 139.929C84.3717 128.761 93.1932 113.903 96.8385 97.1034C114.263 121.327 112.09 155.233 90.311 177.037L89.9466 177.403ZM94.2578 128.351C97.89 124.714 98.2441 119.055 95.3232 115.022C94.0954 117.563 92.7366 120.029 91.2615 122.415C91.5373 124.606 92.5127 126.727 94.1963 128.412L94.2578 128.351Z',
  'M27.5846 151.286C27.5934 136.45 32.801 122.846 41.482 112.187C58.0376 112.949 74.7805 108.678 89.2383 99.3761C84.4324 128.827 58.9193 151.267 28.1012 151.285L27.5846 151.286ZM65.3181 119.65C70.4576 119.646 74.7103 115.894 75.4961 110.977C72.8312 111.907 70.1268 112.69 67.3968 113.333C66.0424 115.077 65.2324 117.267 65.231 119.65H65.3181Z',
  'M1.95585 88.7224C12.4522 78.2385 25.7546 72.2998 39.4302 70.9008C50.5983 83.1461 65.4549 91.9668 82.2556 95.6122C58.0324 113.038 24.1259 110.865 2.32171 89.0868L1.95585 88.7224ZM51.008 93.0337C54.6446 96.6651 60.3044 97.0193 64.3368 94.0983C61.7956 92.8712 59.3298 91.5124 56.9437 90.0366C54.7529 90.3124 52.6317 91.2885 50.9466 92.9715L51.008 93.0337Z',
  'M28.0727 26.3606C42.908 26.3691 56.5134 31.5759 67.1729 40.2569C66.4112 56.8125 70.68 73.5552 79.9815 88.0127C50.531 83.2061 28.0917 57.6946 28.0741 26.8768L28.0727 26.3606ZM59.7095 64.0937C59.7132 69.2336 63.4646 73.4861 68.3817 74.2719C67.4524 71.6071 66.6695 68.9025 66.0256 66.1725C64.2812 64.8181 62.0919 64.0081 59.7095 64.0067V64.0937Z',
];

// Where each petal waits before the lily forms: fraction of the stage from its centre,
// a turn and a size, so the opening screen already holds the mark's own pieces
const PETAL_SCATTER = [
  { x: -0.36, y: -0.3, rotate: -40, scale: 2.2 },
  { x: 0.3, y: -0.34, rotate: 25, scale: 1.8 },
  { x: 0.42, y: 0.02, rotate: 60, scale: 2.4 },
  { x: 0.26, y: 0.32, rotate: -15, scale: 1.6 },
  { x: -0.08, y: 0.4, rotate: 35, scale: 2 },
  { x: -0.4, y: 0.24, rotate: -55, scale: 2.3 },
  { x: -0.46, y: -0.04, rotate: 15, scale: 1.7 },
  { x: 0.06, y: -0.42, rotate: -30, scale: 1.9 },
];

interface ReviewStorySectionProps {
  reviews: GoogleReviewItem[];
}

/**
 * "Nossas clientes falaram": a pinned scroll story. The lily forms, then three statements
 * take turns over it while the reviews arrive two at a time and stay parked around it.
 * Without motion (or script) the statements stack and every review is visible.
 */
export function ReviewStorySection({ reviews }: ReviewStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 1100px) and (min-height: 700px)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
          if (!motion) return;

          const stage = section.querySelector<HTMLElement>('.review-story__stage');
          const center = section.querySelector<HTMLElement>('.review-story__center');
          const lily = section.querySelector<SVGElement>('.review-story__lily');
          const petals = gsap.utils.toArray<SVGPathElement>('.review-story__petal', section);
          const lines = gsap.utils.toArray<HTMLElement>('.review-story__line', section);
          const cards = gsap.utils.toArray<HTMLElement>('.review-story__card', section);
          if (!stage || !center || !lily || lines.length < 3) return;

          section.classList.add('is-sequenced');

          // Motion borrowed from lassie.ai's "98%" infographic: all cards turn together along a
          // clockwise arc of an ellipse centred on the lily for the whole story and land on their
          // parked slots at the end. Each pair fades and scales in with its statement. Slots come
          // from the CSS layout, so the arc is measured backwards from where each card ends up.
          // A wide arc where there is room; a short one so phone decks stay on screen
          const SWEEP = ((desktop ? 110 : 45) * Math.PI) / 180;
          // Near-full-width phone cards would leave the screen on a wide sideways swing
          const SQUASH_X = desktop ? 1 : 0.3;
          const orbits = cards.map(() => ({ dx: 0, dy: 0, rho: 0, end: 0, aspect: 1 }));
          const turn = { t: 0 };
          const appear = cards.map(() => ({ a: 0 }));

          const measure = () => {
            const stageBox = stage.getBoundingClientRect();
            const centerBox = center.getBoundingClientRect();
            const cx = centerBox.left + centerBox.width / 2;
            const cy = centerBox.top + centerBox.height / 2;
            const aspect = stageBox.width / Math.max(1, stageBox.height);
            cards.forEach((card, idx) => {
              const previous = card.style.transform;
              card.style.transform = 'none';
              const box = card.getBoundingClientRect();
              card.style.transform = previous;
              const dx = box.left + box.width / 2 - cx;
              const dy = box.top + box.height / 2 - cy;
              orbits[idx] = { dx, dy, aspect, rho: Math.hypot(dx, dy * aspect), end: Math.atan2(dy * aspect, dx) };
            });
          };

          const place = (idx: number) => {
            const orbit = orbits[idx];
            const { a } = appear[idx];
            const angle = orbit.end - SWEEP * (1 - turn.t);
            gsap.set(cards[idx], {
              x: (Math.cos(angle) * orbit.rho - orbit.dx) * SQUASH_X,
              y: (Math.sin(angle) * orbit.rho) / orbit.aspect - orbit.dy,
              scale: 0.6 + 0.4 * a,
              autoAlpha: a,
            });
          };

          const placeAll = () => cards.forEach((_, idx) => place(idx));
          measure();
          placeAll();

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => `+=${window.innerHeight * (desktop ? 3.2 : 2.8)}`,
              pin: true,
              scrub: 0.6,
              refreshPriority: 2,
              invalidateOnRefresh: true,
              // Native snap without smooth scroll; with Lenis the settle runs through it (below)
              snap: shouldSmoothScroll()
                ? undefined
                : { snapTo: 'labels', duration: { min: 0.2, max: 0.6 }, delay: 0.1, ease: 'power1.inOut' },
              onRefresh: () => {
                measure();
                placeAll();
              },
            },
          });

          // The lily forms: its eight petals are already on screen when the section arrives,
          // large and soft, scattered across the stage; scrolling gathers them into the mark.
          // Offsets are fractions of the stage, converted to the SVG's own units.
          // Scatter around the middle of the screen (phones keep the mark high), smaller and
          // narrower on phones so the pieces stay in view
          const spreadX = desktop ? 1 : 0.82;
          const petalScale = desktop ? 1 : 0.65;
          const lilyUnit = () => Math.max(0.01, lily.getBoundingClientRect().width / 180);
          const centreShiftY = () => {
            const stageBox = stage.getBoundingClientRect();
            const lilyBox = lily.getBoundingClientRect();
            return stageBox.top + stageBox.height / 2 - (lilyBox.top + lilyBox.height / 2);
          };
          const scatterX = (idx: number) =>
            (PETAL_SCATTER[idx % PETAL_SCATTER.length].x * stage.offsetWidth * spreadX) / lilyUnit();
          const scatterY = (idx: number) =>
            (PETAL_SCATTER[idx % PETAL_SCATTER.length].y * stage.offsetHeight + centreShiftY()) / lilyUnit();
          tl.fromTo(
            petals,
            {
              x: scatterX,
              y: scatterY,
              rotate: (idx: number) => PETAL_SCATTER[idx % PETAL_SCATTER.length].rotate,
              scale: (idx: number) => PETAL_SCATTER[idx % PETAL_SCATTER.length].scale * petalScale,
              opacity: 0.16,
              transformOrigin: '50% 50%',
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.inOut',
              stagger: 0.06,
            }
          ).addLabel('formed');

          // Then it steps back to a watermark so the words can sit on it
          tl.to(lily, { opacity: 0.06, scale: 1.06, duration: 0.6, ease: 'power2.inOut' }, 'formed+=0.25');

          // First statement, and every review arrives while it is on screen: pairs fade and
          // scale in one after another, the shared turn carries the movement
          tl.fromTo(lines[0], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '<0.15');
          for (let pairStart = 0; pairStart < cards.length; pairStart += 2) {
            cards.slice(pairStart, pairStart + 2).forEach((_, offset) => {
              const cardIdx = pairStart + offset;
              tl.to(
                appear[cardIdx],
                { a: 1, duration: 0.6, ease: 'power2.out', onUpdate: () => place(cardIdx) },
                offset === 1 ? '<0.08' : pairStart === 0 ? '<0.2' : '>-0.2'
              );
            });
          }
          tl.addLabel('line-1');

          // Each following statement waits for the previous one to leave (it rises a little
          // as it fades), then comes in
          lines.slice(1).forEach((line, idx) => {
            tl.to(lines[idx], { autoAlpha: 0, y: -28, duration: 0.45, ease: 'power2.in' }, '+=0.45')
              .fromTo(line, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55 }, '>0.05')
              .addLabel(`line-${idx + 2}`);
          });

          // A short hold on the last statement before the section releases
          tl.to({}, { duration: 0.5 });

          // One shared turn from the formed lily to the end: every card moves together and
          // decelerates onto its slot as the story finishes
          const turnStart = tl.labels.formed;
          tl.to(
            turn,
            { t: 1, duration: tl.duration() - turnStart, ease: 'power1.out', onUpdate: placeAll },
            turnStart
          );

          const stopSnap = tl.scrollTrigger
            ? snapThroughLenis(tl.scrollTrigger, () =>
                Object.values(tl.labels).map((time) => time / tl.duration())
              )
            : () => {};

          return () => {
            stopSnap();
            gsap.set(cards, { clearProps: 'transform,opacity,visibility' });
            section.classList.remove('is-sequenced');
          };
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="diferenciais" ref={sectionRef} className="celimax-pillars review-story" aria-labelledby="review-story-title">
      <div className="review-story__stage">
        <div className="review-story__center">
          <svg className="review-story__lily" viewBox="0 0 180 180" aria-hidden="true" focusable="false">
            {LILY_PETALS.map((d, idx) => (
              <path key={idx} className="review-story__petal" d={d} fill="#475A38" />
            ))}
          </svg>
          <div className="review-story__lines">
            <p className="review-story__line">Nossas clientes falaram</p>
            <h2 id="review-story-title" className="review-story__line">
              Por que escolher a <em className="editorial-serif">Renovare</em>?
            </h2>
            <p className="review-story__line">
              É sobre cuidado com <em className="editorial-serif">você</em>
            </p>
          </div>
        </div>

        <div className="review-story__cards">
          {/* The slot holds the parked position (never animated); GSAP moves only the card */}
          {reviews.map((review, idx) => (
            <div key={review.id} className={`review-story__slot review-story__slot--${idx + 1}`}>
              <ReviewRatingCard
                review={review}
                slot={idx + 1}
                revealOnScroll={false}
                className="review-story__card"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="celimax-center-cta celimax-pillars__cta review-story__cta">
        <a href={GOOGLE_REVIEWS_SHARE_URL} target="_blank" rel="noopener noreferrer" className="celimax-btn-outline">
          <span>Ver todas as avaliações no Google</span>
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
