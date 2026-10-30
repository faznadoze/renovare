import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { buildWhatsAppUrl } from '../data/renovareContent';
import { shouldSmoothScroll, snapThroughLenis } from '../animations/smoothScroll';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Provisional copy: both photos are the same patient; confirm the protocol name with the clinic
const BA_CASES = [
  {
    id: 'perfil-esquerdo',
    name: 'Contorno abdominal',
    description: 'Perfil esquerdo da mesma paciente, antes e depois: cintura mais marcada e abdômen mais plano.',
    beforeImage: './assets/results/abdomen-perfil-esquerdo-antes.jpg',
    afterImage: './assets/results/abdomen-perfil-esquerdo-depois.jpg',
    beforeAlt: 'Abdômen de paciente em perfil esquerdo, antes do protocolo',
    afterAlt: 'Abdômen da mesma paciente em perfil esquerdo, depois do protocolo',
    title: 'Contorno abdominal, perfil esquerdo',
    initialPosition: 51.8,
  },
  {
    id: 'perfil-direito',
    name: 'Contorno abdominal',
    description: 'O mesmo cuidado visto pelo outro lado: menos volume na barriga e um contorno mais uniforme.',
    beforeImage: './assets/results/abdomen-perfil-direito-antes.jpg',
    afterImage: './assets/results/abdomen-perfil-direito-depois.jpg',
    beforeAlt: 'Abdômen de paciente em perfil direito, antes do protocolo',
    afterAlt: 'Abdômen da mesma paciente em perfil direito, depois do protocolo',
    title: 'Contorno abdominal, perfil direito',
    initialPosition: 55.5,
  },
];

/**
 * Antes & Depois as a pinned scroll story: the stacked result cards rise over the centred
 * title, each case names its protocol beside it (left / right on desktop, above / below on
 * phones), and the top card lifts away to reveal the next. Without motion it is a plain list.
 */
export function BeforeAfterStorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const stage = section.querySelector<HTMLElement>('.ba-story__stage');
        const head = section.querySelector<HTMLElement>('.ba-story__head');
        const cta = section.querySelector<HTMLElement>('.ba-story__cta');
        const cases = gsap.utils.toArray<HTMLElement>('.ba-story__case', section);
        if (!stage || !head || !cta || cases.length < 2) return;

        section.classList.add('is-sequenced');
        const cards = cases.map((item) => item.querySelector<HTMLElement>('.ba-story__card')!);
        const texts = cases.map((item) => item.querySelectorAll<HTMLElement>('.ba-story__text'));
        const below = () => window.innerHeight * 0.95;
        const above = () => -window.innerHeight * 1.05;

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            scrub: 0.6,
            // Above the review story (2) and FAQ (1) pins, so it measures first
            refreshPriority: 3,
            invalidateOnRefresh: true,
            snap: shouldSmoothScroll()
              ? undefined
              : { snapTo: 'labels', duration: { min: 0.2, max: 0.6 }, delay: 0.1, ease: 'power1.inOut' },
          },
        });

        // The stacked cards rise and cover the title; the second waits a little smaller behind
        tl.addLabel('title')
          .fromTo(cards[0], { y: below }, { y: 0, duration: 1 })
          .fromTo(cards[1], { y: below, scale: 0.92 }, { y: 28, scale: 0.92, duration: 1 }, '<0.08')
          .to(head, { autoAlpha: 0, y: -32, duration: 0.5, ease: 'power2.in' }, '<0.45');

        // First protocol name and note
        tl.fromTo(texts[0], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 }).addLabel(
          'case-1'
        );

        // The top card lifts away with its note, revealing the next
        tl.to(texts[0], { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power2.in' }, '+=0.5')
          .to(cards[0], { y: above, duration: 1, ease: 'power2.inOut' }, '<')
          .to(cards[1], { y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, '<0.25')
          .fromTo(texts[1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 }, '>-0.25')
          .addLabel('case-2');

        // The action arrives, a short hold, then the section releases
        tl.fromTo(cta, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '+=0.35')
          .addLabel('cta')
          .to({}, { duration: 0.4 });

        const stopSnap = tl.scrollTrigger
          ? snapThroughLenis(tl.scrollTrigger, () =>
              Object.values(tl.labels).map((time) => time / tl.duration())
            )
          : () => {};

        return () => {
          stopSnap();
          gsap.set([...cards, ...texts.flatMap((list) => Array.from(list)), head, cta], {
            clearProps: 'transform,opacity,visibility',
          });
          section.classList.remove('is-sequenced');
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="antes-depois" ref={sectionRef} className="celimax-ba-section ba-story" aria-labelledby="ba-story-title">
      <div className="ba-story__stage">
        <header className="celimax-ba-header ba-story__head">
          <p className="celimax-ba-header__eyebrow">
            <span className="celimax-ba-header__rule celimax-ba-header__rule--in" aria-hidden="true" />
            <span>Resultados Comprovados</span>
            <span className="celimax-ba-header__rule" aria-hidden="true" />
          </p>
          <h2 id="ba-story-title" className="celimax-section-title celimax-ba-header__title">
            Antes &amp; Depois: testemunhe o poder da <em className="editorial-serif">estética integrativa</em>
          </h2>
        </header>

        <div className="ba-story__deck">
          {BA_CASES.map((item, idx) => (
            <article key={item.id} className={`ba-story__case ba-story__case--${idx + 1}`}>
              <div className="ba-story__card">
                <h3 className="ba-story__text ba-story__name">{item.name}</h3>
                <BeforeAfterSlider
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  beforeAlt={item.beforeAlt}
                  afterAlt={item.afterAlt}
                  title={item.title}
                  initialPosition={item.initialPosition}
                  showLabels={false}
                />
                <p className="ba-story__text ba-story__desc">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="celimax-center-cta ba-story__cta">
          <a
            href={buildWhatsAppUrl(
              'Olá! Vi os resultados de Antes e Depois no site e gostaria de agendar uma avaliação para o meu caso.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="celimax-ba__btn-whatsapp celimax-ba__btn-whatsapp--results"
          >
            <span>Avaliar meu caso no WhatsApp</span>
            <span className="celimax-ba__arrow-badge" aria-hidden="true">
              <img src="./assets/c256d.svg" alt="" width={22.4} height={22.4} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
