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
import { BeforeAfterStorySection } from './components/BeforeAfterStorySection';
import { LoadingScreen, LOADING_DURATION_MS } from './components/LoadingScreen';
import { BlackRenovareSection } from './components/BlackRenovareSection';
import { ReviewStorySection } from './components/ReviewStorySection';
import { VideoHero } from './components/VideoHero';
import { InstagramIcon, WhatsAppIcon } from './components/SocialIcons';
import { scrollPageTo, shouldSmoothScroll, snapThroughLenis, startSmoothScroll } from './animations/smoothScroll';
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
  { text: 'Não viemos consertar você. Viemos' },
  { text: 'revelar', emphasis: true },
  { text: 'quem você sempre foi.' },
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
  // Desktop: the FAQ is pinned and scroll picks the topic (see useGSAP)
  const faqPinRef = useRef<ScrollTrigger | null>(null);
  const faqScrollTargetRef = useRef<number | null>(null);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState<number>(0);
  const [patientName, setPatientName] = useState('');
  const [patientGoal, setPatientGoal] = useState('Ciclo Seca-Barriga & Desintoxicação');
  const [patientPeriod, setPatientPeriod] = useState('Manhã (08h às 12h)');
  const headerRef = useRef<HTMLElement>(null);
  const doctorTrackRef = useRef<HTMLDivElement>(null);
  const doctorScrollFrame = useRef<number | null>(null);

  // Smooth, slightly delayed wheel scroll on desktop pointers (native on touch / reduced motion)
  useEffect(() => startSmoothScroll(LOADING_DURATION_MS), []);

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
    selectFaq(nextIndex);
    faqTabRefs.current[nextIndex]?.focus();
  };

  // When the FAQ is pinned, a topic lives at a scroll position: go there instead of
  // only switching state, and ignore the topics passed on the way
  function selectFaq(index: number) {
    const pin = faqPinRef.current;
    if (pin && FAQ_ITEMS.length > 1) {
      faqScrollTargetRef.current = index;
      window.setTimeout(() => {
        faqScrollTargetRef.current = null;
      }, 1400);
      scrollPageTo(pin.start + (pin.end - pin.start) * (index / (FAQ_ITEMS.length - 1)));
    }
    setActiveFaqIndex(index);
  }

  const faqHoursNote = `Resposta pelo WhatsApp, de ${CLINIC_HOURS.toLowerCase()}.`;

  // GSAP Choreographed scroll reveals with @gsap/react + useGSAP
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

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

      // Desktop FAQ: the topic index is pinned and each topic owns a stretch of scroll
      const faqMedia = gsap.matchMedia();
      faqMedia.add('(min-width: 1100px) and (min-height: 720px)', () => {
        const faqIndex = document.querySelector<HTMLElement>('.faq-index');
        const topicCount = FAQ_ITEMS.length;
        if (!faqIndex || topicCount < 2) return;
        let current = -1;

        const pin = ScrollTrigger.create({
          trigger: faqIndex,
          // Centred when it fits; otherwise held just below the fixed header
          start: () => (faqIndex.offsetHeight + 160 < window.innerHeight ? 'center center' : 'top 88px'),
          end: () => `+=${(topicCount - 1) * window.innerHeight * 0.7}`,
          pin: true,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          // Native snap without smooth scroll; with Lenis the settle runs through it (below)
          snap: shouldSmoothScroll()
            ? undefined
            : {
                snapTo: 1 / (topicCount - 1),
                duration: { min: 0.2, max: 0.5 },
                delay: 0.08,
                ease: 'power2.inOut',
              },
          onUpdate: (self) => {
            const next = Math.round(self.progress * (topicCount - 1));
            const target = faqScrollTargetRef.current;
            if (target !== null) {
              if (next !== target) return;
              faqScrollTargetRef.current = null;
            }
            if (next === current) return;
            current = next;
            setActiveFaqIndex(next);
          },
        });
        faqPinRef.current = pin;
        const stopSnap = snapThroughLenis(pin, () =>
          Array.from({ length: topicCount }, (_, idx) => idx / (topicCount - 1))
        );

        return () => {
          stopSnap();
          faqPinRef.current = null;
        };
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
        {/* 2. HERO: FULL-BLEED VIDEO THAT INSETS WITH ROUNDED CORNERS AS THE PAGE SCROLLS */}
        <VideoHero introDelay={LOADING_DURATION_MS / 1000 + 0.12} />

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

        {/* 3b. BLACK RENOVARE 2026: CAMPAIGN BANNER (Figma frame 15686) WITH A PROTOCOL PICKER */}
        <BlackRenovareSection />

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
        <BeforeAfterStorySection />

        {/* 6. "NOSSAS CLIENTES FALARAM": PINNED SCROLL STORY (LILY FORMS, THREE STATEMENTS, REVIEWS ARRIVE) */}
        <ReviewStorySection reviews={scatteredReviews} />

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
                      onClick={() => selectFaq(idx)}
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
              <ul className="celimax-footer-social">
                <li>
                  <a
                    href="https://www.instagram.com/renovarebetim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="celimax-footer-social__link"
                    aria-label="Instagram da Renovare (@renovarebetim)"
                  >
                    <InstagramIcon size={20} />
                  </a>
                </li>
                <li>
                  <a
                    href={buildWhatsAppUrl('Olá! Vim pelo site da Renovare.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="celimax-footer-social__link"
                    aria-label="Falar com a Renovare no WhatsApp"
                  >
                    <WhatsAppIcon size={20} />
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
