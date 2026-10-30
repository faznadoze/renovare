import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { RenovareLogo } from './components/RenovareLogo';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { LoadingScreen, LOADING_DURATION_MS } from './components/LoadingScreen';
import { ReviewRatingCard } from './components/ReviewRatingCard';
import { createReviewOrbit } from './animations/reviewOrbit';
import {
  CLINIC_ADDRESS,
  CLINIC_HOURS,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  SPECIALISTS,
  FAQ_ITEMS,
  GOOGLE_REVIEWS,
  GOOGLE_REVIEWS_SHARE_URL,
} from './data/renovareContent';

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

const EMIL_EASE_OUT = CustomEase.create('emilEaseOut', 'M0,0 C0.23,1 0.32,1 1,1');

const MANIFESTO_SEGMENTS = [
  { text: 'Não acreditamos em consertar. Acreditamos em' },
  { text: 'revelar', emphasis: true },
  { text: 'a versão de você que já existia antes do mundo ditar quem você deveria ser.' },
];
const MANIFESTO_TEXT = MANIFESTO_SEGMENTS.map((segment) => segment.text).join(' ');
const MANIFESTO_WORDS = MANIFESTO_SEGMENTS.flatMap((segment) =>
  segment.text.split(' ').map((word) => ({ word, emphasis: Boolean(segment.emphasis) }))
);

const PROCEDURE_CARDS = [
  {
    title: 'Criolipólise de Alta Definição',
    description:
      'Remodelagem corporal por congelamento seguro e seletivo das células de gordura. Elimina gordura localizada em flancos, abdômen e culotes sem tempo de recuperação cirúrgico.',
    linkLabel: 'Consultar protocolo',
    whatsappMessage: 'Olá! Quero saber mais sobre a Criolipólise de Alta Definição na Renovare.',
  },
  {
    title: 'Ciclo Seca-Barriga & Detox',
    description:
      'Sinergia exclusiva de drenagem linfática médica, ultrassom cavitacional e ativos termogênicos botânicos. Efeito imediato na redução de inchaço, desintoxicação tecidual e afinamento da cintura.',
    linkLabel: 'Agendar Seca-Barriga',
    whatsappMessage: 'Olá! Quero agendar o Ciclo Seca-Barriga & Detox exclusivo da Renovare.',
  },
  {
    title: 'Emagrecimento Integrativo & Firmeza',
    description:
      'Abordagem 360° que combina estímulo de colágeno dérmico, bioimpedância periódica e acompanhamento individualizado para redução de medidas preservando o tônus e a vitalidade da pele.',
    linkLabel: 'Consultar protocolo',
    whatsappMessage: 'Olá! Gostaria de informações sobre o Protocolo de Emagrecimento Integrativo.',
  },
];

// The Figma stage has six scattered card slots; each visit fills them with a random set of real reviews
const REVIEW_SLOT_COUNT = 6;

const pickRandomReviews = () => {
  const pool = [...GOOGLE_REVIEWS];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, REVIEW_SLOT_COUNT);
};

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number>(0);
  const [scatteredReviews] = useState(pickRandomReviews);
  const faqTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState<number>(0);
  const [patientName, setPatientName] = useState('');
  const [patientGoal, setPatientGoal] = useState('Ciclo Seca-Barriga & Desintoxicação');
  const [patientPeriod, setPatientPeriod] = useState('Manhã (08h às 12h)');
  const headerRef = useRef<HTMLElement>(null);
  const doctorTrackRef = useRef<HTMLDivElement>(null);
  const doctorScrollFrame = useRef<number | null>(null);

  // Header fill follows scroll progress (0 → 1 over the first 160px), eased and
  // damped per frame so the frosted surface fades in instead of snapping on.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const FILL_DISTANCE = 160;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = -1;
    let target = 0;
    let frame: number | null = null;

    const write = () => header.style.setProperty('--nav-fill', current.toFixed(3));

    const step = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.002) current = target;
      write();
      frame = current === target ? null : requestAnimationFrame(step);
    };

    const updateHeaderFill = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / FILL_DISTANCE));
      target = progress * progress * (3 - 2 * progress);

      if (reduceMotion || current < 0) {
        current = target;
        write();
        return;
      }
      if (frame === null) frame = requestAnimationFrame(step);
    };

    updateHeaderFill();
    window.addEventListener('scroll', updateHeaderFill, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateHeaderFill);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // On mobile the track scrolls horizontally; on desktop cards crossfade in place
  const selectDoctor = (index: number) => {
    setCurrentDoctorIndex(index);
    const track = doctorTrackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card || track.scrollWidth <= track.clientWidth) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({
      left: card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const handlePrevDoctor = () => {
    selectDoctor(currentDoctorIndex > 0 ? currentDoctorIndex - 1 : SPECIALISTS.length - 1);
  };

  const handleNextDoctor = () => {
    selectDoctor(currentDoctorIndex < SPECIALISTS.length - 1 ? currentDoctorIndex + 1 : 0);
  };

  const handleDoctorTrackScroll = () => {
    if (doctorScrollFrame.current !== null) return;
    doctorScrollFrame.current = window.requestAnimationFrame(() => {
      doctorScrollFrame.current = null;
      const track = doctorTrackRef.current;
      const firstCard = track?.children[0] as HTMLElement | undefined;
      if (!track || !firstCard || track.scrollWidth <= track.clientWidth) return;
      const step = firstCard.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0');
      const nextIndex = Math.min(SPECIALISTS.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setCurrentDoctorIndex(nextIndex);
    });
  };

  useEffect(
    () => () => {
      if (doctorScrollFrame.current !== null) window.cancelAnimationFrame(doctorScrollFrame.current);
    },
    []
  );

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${patientName}. Gostaria de agendar minha avaliação na Renovare para o objetivo: ${patientGoal}. Minha preferência de horário é: ${patientPeriod}.`;
    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  // Tabs pattern: arrows, Home and End move focus and selection together
  const handleFaqTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = FAQ_ITEMS.length - 1;
    const nextIndex =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? index === last ? 0 : index + 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? index === 0 ? last : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveFaqIndex(nextIndex);
    faqTabRefs.current[nextIndex]?.focus();
  };

  const faqHoursNote = `Resposta pelo WhatsApp, de ${CLINIC_HOURS.toLowerCase()}.`;

  // GSAP Choreographed scroll reveals with @gsap/react + useGSAP
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Hero entrances begin as the loading screen dissolves
      const heroTl = gsap.timeline({
        delay: LOADING_DURATION_MS / 1000 + 0.12,
        defaults: { duration: 0.85, ease: EMIL_EASE_OUT },
      });
      heroTl
        .fromTo('.celimax-hero__copy', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 })
        .fromTo('.celimax-hero__right', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 }, '-=0.55')
        .fromTo('.celimax-hero__bg-frame', { scale: 1.03, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2 }, 0);

      const heroMedia = gsap.matchMedia();

      // Desktop parallax: the backdrop grows and drifts slower than the page while the hero scrolls away
      heroMedia.add('(min-width: 721px)', () => {
        gsap.fromTo(
          '.celimax-hero__backdrop',
          { scale: 1, yPercent: 0 },
          {
            scale: 1.16,
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: '.celimax-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      });

      // Desktop rating cards: 2s after the loading delay they rise from behind the paragraph, hold 3s, retreat
      heroMedia.add('(min-width: 1280px)', () => {
        const ratingCards = gsap.utils.toArray<HTMLElement>('.celimax-hero__rating');
        if (!ratingCards.length) return;
        gsap
          .timeline({ delay: LOADING_DURATION_MS / 1000 + 0.12 + 2 })
          .fromTo(
            ratingCards,
            { autoAlpha: 0, y: 56 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease: EMIL_EASE_OUT, stagger: 0.16 }
          )
          .to(
            ratingCards,
            { autoAlpha: 0, y: 40, duration: 0.7, ease: 'power2.in', stagger: { each: 0.12, from: 'end' } },
            '+=3'
          );
      });

      // Manifesto words ink from gray to olive as the statement crosses the viewport
      gsap.to('.celimax-manifesto__word', {
        color: '#475A38',
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.celimax-manifesto__quote',
          start: 'top 82%',
          end: 'bottom 42%',
          scrub: 0.7,
        },
      });

      const reviewCards = gsap.utils.toArray<HTMLElement>('.js-review-pop');
      const reviewStage = document.querySelector<HTMLElement>('.review-scatter');
      const reviewMedia = gsap.matchMedia();

      // Phones: the deck is dealt by the user's scroll. Each card rises and lands on the
      // previous one over its own stretch of scroll, so one card is read at a time.
      reviewMedia.add('(max-width: 719px)', () => {
        if (!reviewStage) return;
        const DEAL_SPACING = 90;
        const DEAL_LENGTH = 190;

        reviewCards.forEach((card, idx) => {
          const tilt = idx % 2 === 0 ? -1 : 1;
          const offset = idx * DEAL_SPACING;
          const dealt = gsap.timeline({
            scrollTrigger: {
              trigger: reviewStage,
              start: `top+=${offset} 92%`,
              end: `top+=${offset + DEAL_LENGTH} 92%`,
              scrub: 0.5,
            },
          });
          dealt
            .fromTo(
              card,
              { yPercent: 80, rotate: tilt * 4, scale: 0.94 },
              { yPercent: 0, rotate: tilt * 0.5, scale: 1, duration: 1, ease: 'power3.out' },
              0
            )
            .fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'none' }, 0);
        });
      });

      // Tablets: testimonials pop in once; each group entering the viewport reveals in random order
      reviewMedia.add('(min-width: 720px) and (max-width: 1279px)', () => {
        gsap.set(reviewCards, { autoAlpha: 0, scale: 0.9, y: 18 });
        ScrollTrigger.batch(reviewCards, {
          start: 'top 90%',
          once: true,
          interval: 0.15,
          onEnter: (batch) =>
            gsap.to(gsap.utils.shuffle([...batch]), {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.62,
              ease: 'back.out(1.5)',
              stagger: 0.11,
              overwrite: true,
            }),
        });
      });

      // Wide screens: the same pop-in, then the cards orbit the lily
      reviewMedia.add('(min-width: 1280px)', () => {
        if (!reviewStage || !reviewCards.length) return;
        return createReviewOrbit(reviewStage, reviewCards);
      });

      // Progressive entrance without leaving unscrollable content hidden
      const sections = gsap.utils.toArray<HTMLElement>('.js-section-reveal');
      sections.forEach((sec) => {
        const items = sec.querySelectorAll('.js-reveal-item');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 16, opacity: 0.3 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.6,
            ease: EMIL_EASE_OUT,
            scrollTrigger: {
              trigger: sec,
              start: 'top 94%',
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="celimax-theme-wrapper">
      <LoadingScreen />

      {/* 1. FLOATING ISLAND NAVBAR */}
      <div className="celimax-nav-wrapper">
        <header ref={headerRef} className="celimax-nav">
          <a href="#topo" className="celimax-nav__brand" aria-label="Renovare — Início">
            <RenovareLogo variant="symbol" color="currentColor" className="celimax-nav__symbol" />
          </a>

          <nav className="celimax-nav__links" aria-label="Navegação principal">
            <a href="#manifesto" className="celimax-nav__link">
              SOBRE
            </a>
            <a href="#procedimentos" className="celimax-nav__link">
              PROTOCOLOS
            </a>
            <a href="#antes-depois" className="celimax-nav__link">
              ANTES & DEPOIS
            </a>
            <a href="#diferenciais" className="celimax-nav__link">
              DIFERENCIAIS
            </a>
            <a href="#especialistas" className="celimax-nav__link">
              ESPECIALISTAS
            </a>
          </nav>

          <div className="celimax-nav__actions">
            <a
              href={buildWhatsAppUrl(
                'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação estética personalizada em Betim.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="celimax-btn-cta"
            >
              <span className="celimax-btn-cta__full">Agendar Avaliação</span>
              <span className="celimax-btn-cta__short">Agendar</span>
              <span className="celimax-btn-arrow-circle" aria-hidden="true">
                <ArrowUpRight size={25} />
              </span>
            </a>
          </div>
        </header>
      </div>

      <main id="topo">
        {/* 2. HERO SECTION: EDITORIAL BOTÂNICO LIMPO */}
        <section className="celimax-hero celimax-hero--editorial">
          <div className="celimax-hero__container">
            <div className="celimax-hero__backdrop" aria-hidden="true">
              <img
                src="./assets/figma/hero-bg-figma.png"
                alt=""
                className="celimax-hero__backdrop-img"
                fetchPriority="high"
              />
            </div>
            <div className="celimax-hero__overlay" aria-hidden="true" />
            <div className="celimax-hero__grid">
              <div className="celimax-hero__copy">
                <div className="celimax-hero__spacer" aria-hidden="true" />
                <div className="celimax-hero__heading-col">
                  <h1 className="celimax-hero__title">
                    <span className="celimax-hero__title-line">Revele a sua beleza real a cada</span>
                    <span className="celimax-hero__title-separator" aria-hidden="true"> </span>
                    <span className="celimax-hero__title-italic">novo despertar</span>
                  </h1>
                </div>

                <div className="celimax-hero__aside">
                  {/* Desktop only: three real reviews rise from behind the paragraph, then retreat */}
                  <div className="celimax-hero__ratings" aria-hidden="true">
                    {scatteredReviews.slice(0, 3).map((review, idx) => (
                      <ReviewRatingCard
                        key={review.id}
                        review={review}
                        slot={idx + 1}
                        revealOnScroll={false}
                        className="celimax-hero__rating"
                      />
                    ))}
                  </div>

                  <div className="celimax-hero__desc-wrap">
                    <p className="celimax-hero__desc">
                      Ciência estética de precisão, protocolos integrativos e acolhimento humano em Betim para
                      despertar o viço natural, o contorno e a vitalidade que já pertencem ao seu corpo.
                    </p>
                  </div>

                  <div className="celimax-hero__actions-row">
                  <a
                    href={buildWhatsAppUrl(
                      'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação estética personalizada em Betim.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="celimax-hero__btn-main"
                  >
                    <span className="celimax-hero__btn-label celimax-hero__btn-label--desktop">Venha Conhecer</span>
                    <span className="celimax-hero__btn-label celimax-hero__btn-label--mobile">Agende sua avaliação</span>
                    <span className="celimax-hero__arrow-square" aria-hidden="true">
                      <img
                        className="celimax-hero__arrow-img"
                        src="./assets/c256d.svg"
                        alt=""
                        width={22.4}
                        height={22.4}
                      />
                      <ArrowUpRight className="celimax-hero__arrow-icon" size={18} strokeWidth={2.4} />
                    </span>
                  </a>
                  <a href="#procedimentos" className="celimax-hero__btn-secondary">
                    <span>Conhecer Protocolos</span>
                  </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MANIFESTO / GENTLE BEAUTY SECTION WITH 3-PHOTO TRIPTYCH */}
        <section id="manifesto" className="celimax-manifesto js-section-reveal">
          <div className="celimax-manifesto__header js-reveal-item">
            <div className="celimax-manifesto__eyebrow" aria-label="Filosofia Renovare">
              <span className="celimax-manifesto__eyebrow-line" aria-hidden="true" />
              <span>Filosofia Renovare</span>
              <span className="celimax-manifesto__eyebrow-line celimax-manifesto__eyebrow-line--reverse" aria-hidden="true" />
            </div>
            <h2 className="celimax-manifesto__quote">
              <span className="sr-only">{MANIFESTO_TEXT}</span>
              <span aria-hidden="true">
                {MANIFESTO_WORDS.map(({ word, emphasis }, idx) => (
                  <React.Fragment key={`${word}-${idx}`}>
                    {idx > 0 && ' '}
                    {emphasis ? (
                      <em className="celimax-manifesto__word">{word}</em>
                    ) : (
                      <span className="celimax-manifesto__word">{word}</span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </h2>
            <p className="celimax-manifesto__sub">
              A Renovare nasceu em Betim para ser um lugar de pausa e acolhimento. Sem padrões inatingíveis
              ou promessas artificiais: cada protocolo é planejado para realçar a sua anatomia com
              naturalidade e segurança.
            </p>
          </div>

          <div className="celimax-triptych js-reveal-item">
            <div className="celimax-triptych__card celimax-triptych__card--side">
              <img
                src="./assets/clinic/manta-termica.jpg"
                alt="Profissional ajustando a manta térmica sobre a paciente relaxada na maca"
                className="celimax-triptych__img"
                width={1000}
                height={1329}
                loading="lazy"
              />
            </div>
            <div className="celimax-triptych__card celimax-triptych__card--center">
              <img
                src="./assets/clinic/facial-marcacao.jpg"
                alt="Profissional da Renovare marcando o rosto da paciente antes de um procedimento facial"
                className="celimax-triptych__img"
                width={1000}
                height={1428}
                loading="lazy"
              />
            </div>
            <div className="celimax-triptych__card celimax-triptych__card--side">
              <img
                src="./assets/clinic/criolipolise-sessao.jpg"
                alt="Paciente relaxada durante uma sessão de criolipólise no abdômen"
                className="celimax-triptych__img"
                width={1000}
                height={1330}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* 4. PROCEDURES: THREE EQUAL CARDS; HOVER OR FOCUS TILTS ONE INTO THE LIME FEATURE */}
        <section id="procedimentos" className="celimax-procedures js-section-reveal">
          <div className="celimax-procedures__container">
            <div className="celimax-split-header js-reveal-item">
              <div>
                <p className="celimax-procedures__eyebrow">
                  <span>Nossos Procedimentos</span>
                  <span className="celimax-procedures__eyebrow-rule" aria-hidden="true" />
                </p>
                <h2 className="celimax-section-title celimax-section-title--procedures">
                  Tecnologias que respeitam sua <em className="editorial-serif">natureza</em>
                </h2>
              </div>
              <a
                href={buildWhatsAppUrl(
                  'Olá! Gostaria de consultar todos os procedimentos e protocolos estéticos da Renovare.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="celimax-btn-outline celimax-procedures__all"
              >
                <span>Ver todos os protocolos</span>
                <img src="./assets/38f39.svg" alt="" width={16} height={16} />
              </a>
            </div>

            <div className="celimax-procedures__grid js-reveal-item">
              {PROCEDURE_CARDS.map((card, idx) => (
                // The cell owns the hover so the tilted card edge never flickers in and out of :hover
                <div key={card.title} className="celimax-procedures__cell">
                  <article className="celimax-card">
                    <div>
                      <p className="celimax-card__num" aria-hidden="true">
                        {String(idx + 1).padStart(2, '0')}
                      </p>
                      <h3 className="celimax-card__title">{card.title}</h3>
                      <p className="celimax-card__desc">{card.description}</p>
                    </div>
                    <a
                      href={buildWhatsAppUrl(card.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="celimax-card__link"
                    >
                      <span>{card.linkLabel}</span>
                      <span className="celimax-card__arrow" aria-hidden="true">
                        <img src="./assets/38f39.svg" alt="" width={16} height={16} />
                        <img src="./assets/2e1e7.svg" alt="" width={16.32} height={16.32} />
                      </span>
                    </a>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BEFORE & AFTER INTERACTIVE SPLIT SLIDERS */}
        <section id="antes-depois" className="celimax-ba-section js-section-reveal">
          <div className="celimax-ba-section__container">
            <div className="celimax-ba-header js-reveal-item">
              <p className="celimax-ba-header__eyebrow">
                <span className="celimax-ba-header__rule celimax-ba-header__rule--in" aria-hidden="true" />
                <span>Resultados Comprovados</span>
                <span className="celimax-ba-header__rule" aria-hidden="true" />
              </p>
              <h2 className="celimax-section-title celimax-ba-header__title">
                Antes &amp; Depois: testemunhe o poder da{' '}
                <em className="editorial-serif">estética integrativa</em>
              </h2>
              <p className="celimax-ba-header__lead">
                Arraste o cursor horizontalmente em cada imagem para comparar a evolução real das nossas
                pacientes na clínica Renovare em Betim.
              </p>
            </div>

            <div className="celimax-ba-grid js-reveal-item">
              <BeforeAfterSlider
                beforeImage="./assets/results/abdomen-perfil-esquerdo-antes.jpg"
                afterImage="./assets/results/abdomen-perfil-esquerdo-depois.jpg"
                beforeAlt="Abdômen de paciente em perfil esquerdo, antes do protocolo"
                afterAlt="Abdômen da mesma paciente em perfil esquerdo, depois do protocolo"
                title="Contorno abdominal, perfil esquerdo"
                initialPosition={51.8}
                showLabels={false}
              />

              <BeforeAfterSlider
                beforeImage="./assets/results/abdomen-perfil-direito-antes.jpg"
                afterImage="./assets/results/abdomen-perfil-direito-depois.jpg"
                beforeAlt="Abdômen de paciente em perfil direito, antes do protocolo"
                afterAlt="Abdômen da mesma paciente em perfil direito, depois do protocolo"
                title="Contorno abdominal, perfil direito"
                initialPosition={55.5}
                showLabels={false}
              />
            </div>

            <div className="celimax-center-cta js-reveal-item">
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

        {/* 6. GOOGLE TESTIMONIALS AROUND CENTRAL ELEMENT ("Why you choose Renovare") */}
        <section id="diferenciais" className="celimax-pillars js-section-reveal">
          <div className="celimax-pillars__container">
            <div className="celimax-pillars__header js-reveal-item">
              <p className="celimax-ba-header__eyebrow">
                <span className="celimax-ba-header__rule celimax-ba-header__rule--in" aria-hidden="true" />
                <span>nossas clientes falaram</span>
                <span className="celimax-ba-header__rule" aria-hidden="true" />
              </p>
              <h2 className="celimax-section-title celimax-ba-header__title">
                Por que escolher a <em className="editorial-serif">Renovare</em> em Betim?
              </h2>
              <p className="celimax-ba-header__lead">
                Conheça os pilares que tornam nossos protocolos seguros, transformadores e reconhecidos pela
                ética e naturalidade.
              </p>
            </div>

            <div className="review-scatter">
              <img
                className="review-scatter__lily"
                src="./assets/17506.svg"
                alt=""
                width={180}
                height={180}
              />
              {scatteredReviews.map((review, idx) => (
                <ReviewRatingCard key={review.id} review={review} slot={idx + 1} />
              ))}
            </div>

            <div className="celimax-center-cta celimax-pillars__cta js-reveal-item">
              <a
                href={GOOGLE_REVIEWS_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="celimax-btn-outline"
              >
                <span>Ver todas as avaliações no Google</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* 7. DOCTOR / SPECIALIST SPOTLIGHT STAGE (Figma node 5389:1861) */}
        <section id="especialistas" className="celimax-doctor-section js-section-reveal">
          <div className="celimax-doctor-section__container">
            <div className="celimax-doctor-stage js-reveal-item">
              {/* Ambient SVGs from Figma */}
              <img
                src="./assets/figma/wine-shadow.svg"
                alt=""
                className="celimax-doctor-ambient celimax-doctor-ambient--wine"
                aria-hidden="true"
              />
              <img
                src="./assets/figma/sienna-glow.svg"
                alt=""
                className="celimax-doctor-ambient celimax-doctor-ambient--sienna"
                aria-hidden="true"
              />
              <img
                src="./assets/figma/crimson-depth.svg"
                alt=""
                className="celimax-doctor-ambient celimax-doctor-ambient--crimson"
                aria-hidden="true"
              />
              <img
                src="./assets/figma/warm-highlight.svg"
                alt=""
                className="celimax-doctor-ambient celimax-doctor-ambient--warm"
                aria-hidden="true"
              />

              {/* Stage Header */}
              <div className="celimax-doctor-stage__header">
                <div>
                  <h2 className="celimax-doctor-stage__title">
                    Corpo Clínico Especializado
                  </h2>
                </div>
                <p className="celimax-doctor-stage__quote">
                  Nosso corpo clínico é comprometido em entregar o mais alto padrão estético com empatia,
                  escuta humana e respeito absoluto à sua individualidade.
                </p>
              </div>

              {/* Stage Body */}
              <div className="celimax-doctor-stage__body">
                <div
                  ref={doctorTrackRef}
                  className="celimax-doctor-track"
                  onScroll={handleDoctorTrackScroll}
                  aria-label="Profissionais da Renovare"
                >
                  {SPECIALISTS.map((doctor, idx) => (
                    <article
                      key={doctor.id}
                      className={`celimax-doctor-card ${idx === currentDoctorIndex ? 'is-active' : ''}`}
                      aria-label={`${idx + 1} de ${SPECIALISTS.length}: ${doctor.name}`}
                    >
                      <div className="celimax-doctor-stage__portrait">
                        <img src={doctor.imageSrc} alt={doctor.imageAlt} loading="lazy" />
                      </div>

                      <div className="celimax-doctor-stage__content">
                        <h3 className="celimax-doctor-stage__spec-title">Especialização Clínica</h3>
                        <p className="celimax-doctor-stage__spec-bio">{doctor.bio}</p>

                        {doctor.focusAreas && doctor.focusAreas.length > 0 && (
                          <div className="celimax-doctor-stage__tags" aria-label="Áreas de foco">
                            {doctor.focusAreas.map((area) => (
                              <span key={area} className="celimax-doctor-stage__tag">
                                {area}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="celimax-doctor-stage__meta-row">
                          <div>
                            <h4 className="celimax-doctor-stage__name">{doctor.name}</h4>
                            <p className="celimax-doctor-stage__role">{doctor.role}</p>
                            {doctor.registry && <p className="celimax-doctor-stage__reg">{doctor.registry}</p>}
                          </div>

                          <a
                            href={buildWhatsAppUrl(
                              `Olá! Gostaria de agendar uma consulta com ${doctor.name} na Clínica Renovare em Betim.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="celimax-doctor__btn-cta"
                          >
                            <span>Agendar com {doctor.name.replace(/^Dr\.\s*/, '').split(' ')[0]}</span>
                            <span className="celimax-doctor__btn-badge" aria-hidden="true">
                              <ArrowUpRight size={18} />
                            </span>
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Doctor pagination indicator */}
                <div className="celimax-doctor__pagination-wrap">
                  <div className="celimax-doctor__page-arrows">
                    <button
                      type="button"
                      className="celimax-doctor__page-arrow"
                      onClick={handlePrevDoctor}
                      aria-label="Ver profissional anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="celimax-doctor__page-arrow"
                      onClick={handleNextDoctor}
                      aria-label="Ver próximo profissional"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="celimax-doctor__page-numbers" aria-label="Navegar entre profissionais">
                    {SPECIALISTS.map((spec, idx) => {
                      const isActive = currentDoctorIndex === idx;
                      const numStr = (idx + 1).toString().padStart(2, '0');
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          className={`celimax-doctor__page-num ${
                            isActive ? 'celimax-doctor__page-num--active' : ''
                          }`}
                          onClick={() => selectDoctor(idx)}
                          aria-label={`Ver profissional ${numStr}: ${spec.name}`}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          {numStr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQ: TOPIC INDEX WITH ANSWER, PICTURE AND TOPIC-AWARE WHATSAPP QUESTION */}
        <section id="faq" className="celimax-faq-section js-section-reveal">
          <div className="celimax-faq-section__container">
            <div className="faq-index">
              <header className="faq-index__head js-reveal-item">
                <h2 className="faq-index__title">Dúvidas frequentes</h2>
                <p className="faq-index__lead">
                  O que mais nos perguntam antes da primeira sessão, respondido pela equipe da clínica.
                  Escolha um assunto.
                </p>
              </header>

              <div
                className="faq-index__topics js-reveal-item"
                role="tablist"
                aria-label="Assuntos das dúvidas frequentes"
              >
                {FAQ_ITEMS.map((item, idx) => {
                  const isActive = idx === activeFaqIndex;
                  return (
                    <button
                      key={item.topic}
                      ref={(node) => {
                        faqTabRefs.current[idx] = node;
                      }}
                      id={`faq-tab-${idx}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`faq-panel-${idx}`}
                      tabIndex={isActive ? 0 : -1}
                      className={`faq-index__topic ${isActive ? 'is-active' : ''}`}
                      onClick={() => setActiveFaqIndex(idx)}
                      onKeyDown={(event) => handleFaqTabKeyDown(event, idx)}
                    >
                      <span>{item.topic}</span>
                      <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              {/* Every answer stays mounted in one grid cell, so the card keeps the tallest height and never jumps */}
              <div className="faq-index__panel js-reveal-item">
                {FAQ_ITEMS.map((item, idx) => {
                  const isActive = idx === activeFaqIndex;
                  return (
                    <div
                      key={item.topic}
                      id={`faq-panel-${idx}`}
                      role="tabpanel"
                      aria-labelledby={`faq-tab-${idx}`}
                      tabIndex={isActive ? 0 : -1}
                      inert={!isActive}
                      className={`faq-index__answer ${isActive ? 'is-active' : ''}`}
                    >
                      <p className="faq-index__question">{item.question}</p>
                      <p className="faq-index__text">{item.answer}</p>
                      <a
                        href={buildWhatsAppUrl(
                          `Olá! Li as dúvidas frequentes no site da Renovare e tenho uma pergunta sobre ${item.topic}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="celimax-ba__btn-whatsapp faq-index__ask"
                        aria-label={`Perguntar sobre ${item.topic} no WhatsApp`}
                      >
                        <span>Perguntar sobre {item.topic}</span>
                        <span className="celimax-ba__arrow-badge" aria-hidden="true">
                          <ArrowUpRight size={18} />
                        </span>
                      </a>
                      <p className="faq-index__hours">{faqHoursNote}</p>
                    </div>
                  );
                })}
              </div>

              <figure className="faq-index__figure js-reveal-item">
                {FAQ_ITEMS.map((item, idx) => {
                  const isActive = idx === activeFaqIndex;
                  return (
                    <img
                      key={item.topic}
                      src={item.imageSrc}
                      alt={isActive ? item.imageAlt : ''}
                      aria-hidden={isActive ? undefined : true}
                      loading="lazy"
                      className={`faq-index__img ${isActive ? 'is-active' : ''}`}
                      style={{ objectPosition: item.imagePosition }}
                    />
                  );
                })}
              </figure>
            </div>
          </div>
        </section>

        {/* 9. PASSE DE ATENDIMENTO & FORMULÁRIO WHATSAPP */}
        <section id="agendamento" className="contact-section js-section-reveal">
          <div className="container">
            <div className="coupon-card glass-surface glass-surface--heavy js-reveal-item">
              <div className="coupon-card__left">
                <div>
                  <span className="section-kicker section-kicker--light">Passe de Atendimento</span>
                  <h2 className="coupon-heading">
                    Agende sua avaliação em <em className="editorial-serif">Betim</em>
                  </h2>
                  <p className="coupon-subcopy">
                    Preencha seu nome e objetivo ao lado para abrir o WhatsApp da clínica com seu
                    passe de atendimento preenchido, ou venha nos visitar no Bairro Angola.
                  </p>
                </div>

                <div className="coupon-location-details">
                  <div className="coupon-detail-item">
                    <MapPin size={18} aria-hidden="true" />
                    <div>
                      <strong>Endereço</strong>
                      <span>{CLINIC_ADDRESS}</span>
                    </div>
                  </div>
                  <div className="coupon-detail-item">
                    <Clock size={18} aria-hidden="true" />
                    <div>
                      <strong>Horário de atendimento</strong>
                      <span>{CLINIC_HOURS}</span>
                    </div>
                  </div>
                  <div className="coupon-detail-item">
                    <MessageCircle size={18} aria-hidden="true" />
                    <div>
                      <strong>WhatsApp Direto</strong>
                      <span>{WHATSAPP_DISPLAY}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="coupon-perforation" aria-hidden="true" />

              <form className="coupon-card__right" onSubmit={handleCouponSubmit}>
                <div className="form-field">
                  <label htmlFor="patient-name" className="sr-only">
                    Seu nome completo
                  </label>
                  <input
                    id="patient-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="patient-goal" className="sr-only">
                    Qual o seu foco principal?
                  </label>
                  <select
                    id="patient-goal"
                    value={patientGoal}
                    onChange={(e) => setPatientGoal(e.target.value)}
                  >
                    <option value="Ciclo Seca-Barriga & Desintoxicação">
                      Foco: Ciclo Seca-Barriga & Desintoxicação
                    </option>
                    <option value="Criolipólise de Alta Definição">
                      Foco: Criolipólise / Gordura Localizada
                    </option>
                    <option value="Emagrecimento Integrativo & Firmeza">
                      Foco: Emagrecimento Integrativo & Firmeza
                    </option>
                    <option value="Rejuvenescimento Facial e Viço">
                      Foco: Rejuvenescimento Facial e Viço Dérmico
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="patient-period" className="sr-only">
                    Período de preferência
                  </label>
                  <select
                    id="patient-period"
                    value={patientPeriod}
                    onChange={(e) => setPatientPeriod(e.target.value)}
                  >
                    <option value="Manhã (08h às 12h)">Preferência: Manhã (08h às 12h)</option>
                    <option value="Tarde (12h às 17h)">Preferência: Tarde (12h às 17h)</option>
                    <option value="Final do dia (17h às 19h30)">
                      Preferência: Final do dia (17h às 19h30)
                    </option>
                    <option value="Sábado">Preferência: Sábado</option>
                  </select>
                </div>

                <button type="submit" className="coupon-submit-bar">
                  <span className="coupon-submit-bar__text">Enviar para o WhatsApp</span>
                  <ArrowUpRight size={20} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* 10. MONUMENTAL ARCHITECTURAL FOOTER */}
      <footer className="celimax-footer">
        <div className="celimax-footer__container">
          <div className="celimax-footer-grid">
            {/* Col 1 */}
            <div className="celimax-footer-col">
              <h4>Clínica Renovare</h4>
              <p>
                Rua do Rosário, 1181 · Bairro Angola<br />
                Betim - MG · CEP 32604-115
              </p>
              <p>Horário: {CLINIC_HOURS}</p>
              <p>WhatsApp: {WHATSAPP_DISPLAY}</p>
            </div>

            {/* Col 2 */}
            <div className="celimax-footer-col">
              <h4>Protocolos</h4>
              <ul>
                <li>
                  <a href="#procedimentos">Criolipólise Avançada</a>
                </li>
                <li>
                  <a href="#procedimentos">Ciclo Seca-Barriga</a>
                </li>
                <li>
                  <a href="#procedimentos">Emagrecimento Integrativo</a>
                </li>
                <li>
                  <a href="#procedimentos">Bioestímulo de Colágeno</a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="celimax-footer-col">
              <h4>Experiência</h4>
              <ul>
                <li>
                  <a href="#manifesto">Filosofia Renovare</a>
                </li>
                <li>
                  <a href="#antes-depois">Resultados Clínicos</a>
                </li>
                <li>
                  <a href="#diferenciais">Nossos Diferenciais</a>
                </li>
                <li>
                  <a href="#faq">Perguntas Frequentes</a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="celimax-footer-col">
              <h4>Redes Sociais</h4>
              <ul>
                <li>
                  <a
                    href="https://www.instagram.com/renovare_betim"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram (@renovare_betim)
                  </a>
                </li>
                <li>
                  <a
                    href={buildWhatsAppUrl('Olá! Vim pelo site da Renovare.')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Direto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="celimax-footer-bottom-bar">
            <p>© {new Date().getFullYear()} Clínica Renovare Estética e Bem-Estar. Todos os direitos reservados.</p>
            <div className="celimax-footer-links">
              <a href="#topo">Privacidade</a>
              <span>·</span>
              <a href="#topo">Termos de Atendimento</a>
            </div>
          </div>
        </div>

        {/* MONUMENTAL ARCHITECTURAL BRAND WORDMARK EMERGING FROM BASE WITH 25% HIDDEN ON Y */}
        <div className="celimax-footer-monumental" aria-hidden="true">
          <RenovareLogo
            variant="wordmark"
            color="#DBE4A9"
            className="celimax-footer-logo-svg"
            ariaLabel="Renovare"
          />
        </div>
      </footer>
    </div>
  );
}

export default App;
