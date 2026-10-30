import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { RenovareLogo } from './components/RenovareLogo';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import {
  CLINIC_ADDRESS,
  CLINIC_HOURS,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  SPECIALISTS,
  FAQ_ITEMS,
} from './data/renovareContent';

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

const EMIL_EASE_OUT = CustomEase.create('emilEaseOut', 'M0,0 C0.23,1 0.32,1 1,1');

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0); // First item open matching Celimax
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState<number>(0);
  const [patientName, setPatientName] = useState('');
  const [patientGoal, setPatientGoal] = useState('Ciclo Seca-Barriga & Desintoxicação');
  const [patientPeriod, setPatientPeriod] = useState('Manhã (08h às 12h)');

  const currentDoctor = SPECIALISTS[currentDoctorIndex];

  const handlePrevDoctor = () => {
    setCurrentDoctorIndex((prev) => (prev > 0 ? prev - 1 : SPECIALISTS.length - 1));
  };

  const handleNextDoctor = () => {
    setCurrentDoctorIndex((prev) => (prev < SPECIALISTS.length - 1 ? prev + 1 : 0));
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${patientName}. Gostaria de agendar minha avaliação na Renovare para o objetivo: ${patientGoal}. Minha preferência de horário é: ${patientPeriod}.`;
    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  // GSAP Choreographed scroll reveals with @gsap/react + useGSAP
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Hero entrances
      const heroTl = gsap.timeline({ defaults: { duration: 0.85, ease: EMIL_EASE_OUT } });
      heroTl
        .fromTo('.celimax-hero__copy', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 })
        .fromTo('.celimax-hero__right', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 }, '-=0.55')
        .fromTo('.celimax-hero__bg-frame', { scale: 1.03, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2 }, 0);

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
      {/* 1. FLOATING ISLAND NAVBAR */}
      <div className="celimax-nav-wrapper">
        <header className="celimax-nav">
          <a href="#topo" className="celimax-nav__brand" aria-label="Renovare — Início">
            <RenovareLogo variant="symbol" color="#475A38" className="celimax-nav__symbol" />
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
            <div className="celimax-hero__grid">
              <div className="celimax-hero__backdrop" aria-hidden="true">
                <img
                  src="./assets/figma/hero-bg-figma.png"
                  alt=""
                  className="celimax-hero__backdrop-img"
                  fetchPriority="high"
                />
              </div>

              <div className="celimax-hero__copy">
                <div className="celimax-hero__spacer" aria-hidden="true" />
                <h1 className="celimax-hero__title">
                  <span className="celimax-hero__title-line">Revele a sua beleza real </span>
                  <span className="celimax-hero__title-line">
                    a cada <em className="celimax-hero__title-italic">novo despertar</em>
                  </span>
                </h1>
                <p className="celimax-hero__desc">
                  Ciência estética de precisão, protocolos integrativos e acolhimento humano em Betim para
                  despertar o viço natural, o contorno e a vitalidade que já pertencem ao seu corpo.
                </p>

                <div className="celimax-hero__actions-row">
                  <a
                    href={buildWhatsAppUrl(
                      'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação estética personalizada em Betim.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="celimax-hero__btn-main"
                  >
                    <span>Agende sua avaliação</span>
                    <span className="celimax-hero__arrow-square" aria-hidden="true">
                      <ArrowUpRight size={18} strokeWidth={2.4} />
                    </span>
                  </a>
                  <a href="#procedimentos" className="celimax-hero__btn-secondary">
                    <span>Conhecer Protocolos</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MANIFESTO / GENTLE BEAUTY SECTION WITH 3-PHOTO TRIPTYCH */}
        <section id="manifesto" className="celimax-manifesto js-section-reveal">
          <div className="celimax-manifesto__header js-reveal-item">
            <h2 className="celimax-manifesto__title">Filosofia Renovare</h2>
            <blockquote className="celimax-manifesto__quote">
              “Não acreditamos em consertar. Acreditamos em{' '}
              <em className="editorial-serif">revelar</em> —{' '}
              <span className="celimax-manifesto__highlight">
                a versão de você que já existia antes do mundo ditar quem você deveria ser.”
              </span>
            </blockquote>
            <p className="celimax-manifesto__sub">
              A Renovare nasceu em Betim para ser um lugar de pausa e acolhimento. Sem padrões inatingíveis
              ou promessas artificiais: cada protocolo é planejado para realçar a sua anatomia com
              naturalidade e segurança.
            </p>
          </div>

          <div className="celimax-triptych js-reveal-item">
            <div className="celimax-triptych__card celimax-triptych__card--side">
              <img
                src="./assets/people/hero-woman-natural.jpg"
                alt="Mulher cuidando da pele com suavidade"
                className="celimax-triptych__img"
                loading="lazy"
              />
            </div>
            <div className="celimax-triptych__card celimax-triptych__card--center">
              <img
                src="./assets/people/manifesto-woman-mirror.jpg"
                alt="Mulher se olhando com afeto no espelho"
                className="celimax-triptych__img"
                loading="lazy"
              />
            </div>
            <div className="celimax-triptych__card celimax-triptych__card--side">
              <img
                src="./assets/people/hero-woman-portrait.jpg"
                alt="Sorriso natural e pele saudável"
                className="celimax-triptych__img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* 4. PROCEDURES: ASYMMETRIC GRID WITH TILTED LIME HIGHLIGHT CARD */}
        <section id="procedimentos" className="celimax-procedures js-section-reveal">
          <div className="celimax-procedures__container">
            <div className="celimax-split-header js-reveal-item">
              <div>
                <h2 className="celimax-section-title">
                  Tecnologias que respeitam sua <em className="editorial-serif">natureza</em>
                </h2>
              </div>
              <a
                href={buildWhatsAppUrl(
                  'Olá! Gostaria de consultar todos os procedimentos e protocolos estéticos da Renovare.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="celimax-btn-outline"
              >
                <span>Ver todos os protocolos</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="celimax-procedures__grid js-reveal-item">
              {/* Card 01 */}
              <article className="celimax-card">
                <div>
                  <h3 className="celimax-card__title">Criolipólise de Alta Definição</h3>
                  <p className="celimax-card__desc">
                    Remodelagem corporal por congelamento seguro e seletivo das células de gordura. Elimina
                    gordura localizada em flancos, abdômen e culotes sem tempo de recuperação cirúrgico.
                  </p>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    'Olá! Quero saber mais sobre a Criolipólise de Alta Definição na Renovare.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="celimax-card__link"
                >
                  <span>Consultar protocolo</span>
                  <ArrowUpRight size={16} />
                </a>
              </article>

              {/* Card 02 */}
              <article className="celimax-card celimax-card--highlight">
                <div>
                  <h3 className="celimax-card__title">Ciclo Seca-Barriga & Detox</h3>
                  <p className="celimax-card__desc">
                    Sinergia exclusiva de drenagem linfática médica, ultrassom cavitacional e ativos
                    termogênicos botânicos. Efeito imediato na redução de inchaço, desintoxicação tecidual e
                    afinamento da cintura.
                  </p>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    'Olá! Quero agendar o Ciclo Seca-Barriga & Detox exclusivo da Renovare.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="celimax-card__link"
                >
                  <span>Agendar Seca-Barriga</span>
                  <ArrowUpRight size={16} />
                </a>
              </article>

              {/* Card 03 */}
              <article className="celimax-card">
                <div>
                  <h3 className="celimax-card__title">
                    Emagrecimento <br />
                    Integrativo &amp; Firmeza
                  </h3>
                  <p className="celimax-card__desc">
                    Abordagem 360° que combina estímulo de colágeno dérmico, bioimpedância periódica e
                    acompanhamento individualizado para redução de medidas preservando o tônus e a
                    vitalidade da pele.
                  </p>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    'Olá! Gostaria de informações sobre o Protocolo de Emagrecimento Integrativo.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="celimax-card__link"
                >
                  <span>Consultar protocolo</span>
                  <ArrowUpRight size={16} />
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* 5. BEFORE & AFTER INTERACTIVE SPLIT SLIDERS */}
        <section id="antes-depois" className="celimax-ba-section js-section-reveal">
          <div className="celimax-ba-section__container">
            <div className="celimax-ba-header js-reveal-item">
              <h2 className="celimax-section-title">
                Resultados Reais na <em className="editorial-serif">Renovare</em>
              </h2>
              <p className="celimax-manifesto__sub" style={{ marginTop: '12px' }}>
                Arraste o cursor horizontalmente em cada imagem para comparar a evolução real das nossas
                pacientes na clínica Renovare em Betim.
              </p>
            </div>

            <div className="celimax-ba-grid js-reveal-item">
              <BeforeAfterSlider
                beforeImage="./assets/people/hero-woman-portrait.jpg"
                afterImage="./assets/people/hero-woman-glow.jpg"
                category="Rejuvenescimento Facial & Viço"
                title="Renovação de Textura e Luminosidade"
                description="Paciente apresentava opacidade e linhas finas de desidratação. Após o ciclo integrativo de bioestímulo e ativos dermocosméticos, a pele reconquistou viço e firmeza."
                initialPosition={48}
              />

              <BeforeAfterSlider
                beforeImage="./assets/people/treatment-secabarriga.jpg"
                afterImage="./assets/people/treatment-crio.jpg"
                category="Remodelação Abdominal"
                title="Afinamento de Cintura & Redução de Medidas"
                description="Combinação personalizada do Protocolo Seca-Barriga com Criolipólise de Alta Definição: redução notável de retenção hídrica e dobra adiposa com contorno harmonioso."
                initialPosition={52}
              />
            </div>

            <div className="celimax-center-cta js-reveal-item">
              <a
                href={buildWhatsAppUrl(
                  'Olá! Vi os resultados de Antes e Depois no site e gostaria de agendar uma avaliação para o meu caso.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="celimax-ba__btn-whatsapp"
              >
                <span>Avaliar meu caso no WhatsApp</span>
                <span className="celimax-ba__arrow-badge" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* 6. PILLARS AROUND CENTRAL ELEMENT ("Why you choose Renovare" - Figma node 5389:424) */}
        <section id="diferenciais" className="celimax-pillars js-section-reveal">
          <div className="celimax-pillars__container">
            <div className="celimax-pillars__header js-reveal-item">
              <h2 className="celimax-section-title">
                Por que escolher a <em className="editorial-serif">Renovare</em> em Betim?
              </h2>
              <p className="celimax-manifesto__sub" style={{ marginTop: '12px' }}>
                Conheça os pilares que tornam nossos protocolos seguros, transformadores e reconhecidos pela
                ética e naturalidade.
              </p>
            </div>

            <div className="celimax-pillars__stage js-reveal-item">
              {/* Left Pillars */}
              <div className="celimax-pillar-stack">
                <div className="celimax-pillar-card">
                  <span className="celimax-pillar-card__badge">Corpo Clínico Experiente</span>
                  <h3 className="celimax-pillar-card__title">Especialistas Qualificadas</h3>
                  <p className="celimax-pillar-card__text">
                    Biomédicas estetas e profissionais de saúde com capacitação contínua e olhar ético,
                    garantindo segurança anatômica em cada procedimento.
                  </p>
                </div>

                <div className="celimax-pillar-card">
                  <span className="celimax-pillar-card__badge">Cuidado Personalizado</span>
                  <h3 className="celimax-pillar-card__title">Planos Sob Medida</h3>
                  <p className="celimax-pillar-card__text">
                    Não vendemos pacotes engessados de balcão. Cada plano é formulado a partir da sua
                    Avaliação 360°, respeitando seu histórico, biotipo e rotina.
                  </p>
                </div>
              </div>

              {/* Center Botanical Piece */}
              <div className="celimax-pillars__centerpiece">
                <div className="celimax-centerpiece-disc">
                  <RenovareLogo
                    variant="symbol"
                    color="#475A38"
                    className="celimax-centerpiece-logo"
                    ariaLabel="Lírio Renovare"
                  />
                </div>
                <p className="celimax-centerpiece-caption">
                  “Beleza real não precisa de filtro.”
                </p>
              </div>

              {/* Right Pillars */}
              <div className="celimax-pillar-stack">
                <div className="celimax-pillar-card">
                  <span className="celimax-pillar-card__badge">Tecnologia Padrão Ouro</span>
                  <h3 className="celimax-pillar-card__title">Equipamentos ANVISA</h3>
                  <p className="celimax-pillar-card__text">
                    Aparelhos de alta precisão 100% regulamentados e calibrados periodicamente, garantindo
                    máxima entrega de energia e total biossegurança.
                  </p>
                </div>

                <div className="celimax-pillar-card">
                  <span className="celimax-pillar-card__badge">Resultados Duradouros</span>
                  <h3 className="celimax-pillar-card__title">Acompanhamento Contínuo</h3>
                  <p className="celimax-pillar-card__text">
                    Monitoramento assistido antes, durante e no pós-sessão com registro fotográfico clínico
                    para consolidar resultados duradouros.
                  </p>
                </div>
              </div>
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
                <div className="celimax-doctor-stage__portrait">
                  <img
                    src={currentDoctor.imageSrc}
                    alt={currentDoctor.imageAlt}
                    loading="lazy"
                  />
                </div>

                <div className="celimax-doctor-stage__content">
                  <h3 className="celimax-doctor-stage__spec-title">Especialização Clínica</h3>
                  <p className="celimax-doctor-stage__spec-bio">{currentDoctor.bio}</p>

                  {currentDoctor.focusAreas && currentDoctor.focusAreas.length > 0 && (
                    <div className="celimax-doctor-stage__tags" aria-label="Áreas de foco">
                      {currentDoctor.focusAreas.map((area, idx) => (
                        <span key={idx} className="celimax-doctor-stage__tag">
                          {area}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="celimax-doctor-stage__meta-row">
                    <div>
                      <h4 className="celimax-doctor-stage__name">{currentDoctor.name}</h4>
                      <p className="celimax-doctor-stage__role">{currentDoctor.role}</p>
                      {currentDoctor.registry && (
                        <p className="celimax-doctor-stage__reg">{currentDoctor.registry}</p>
                      )}
                    </div>

                    <a
                      href={buildWhatsAppUrl(
                        `Olá! Gostaria de agendar uma consulta com ${currentDoctor.name} na Clínica Renovare em Betim.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="celimax-doctor__btn-cta"
                    >
                      <span>Agendar com {currentDoctor.name.replace(/^Dr\.\s*/, '').split(' ')[0]}</span>
                      <span className="celimax-doctor__btn-badge" aria-hidden="true">
                        <ArrowUpRight size={18} />
                      </span>
                    </a>
                  </div>

                  {/* Doctor pagination indicator */}
                  <div className="celimax-doctor__pagination-wrap">
                    <div className="celimax-doctor__page-arrows">
                      <button
                        type="button"
                        className="celimax-doctor__page-arrow"
                        onClick={handlePrevDoctor}
                        aria-label="Especialista anterior"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        className="celimax-doctor__page-arrow"
                        onClick={handleNextDoctor}
                        aria-label="Próxima especialista"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="celimax-doctor__page-numbers" aria-label="Navegar entre especialistas">
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
                            onClick={() => setCurrentDoctorIndex(idx)}
                            aria-label={`Ver especialista ${numStr} - ${spec.name}`}
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
          </div>
        </section>

        {/* 8. FAQ WITH EDITORIAL PORTRAIT */}
        <section id="faq" className="celimax-faq-section js-section-reveal">
          <div className="celimax-faq-section__container">
            <div className="celimax-faq-grid">
              {/* Left Column */}
              <div className="celimax-faq-left js-reveal-item">
                <h2 className="celimax-faq-left__title">
                  Dúvidas Frequentes
                </h2>
                <p className="celimax-faq-left__subtitle">
                  Tudo o que você precisa saber antes de sua primeira sessão na clínica.
                </p>
                <div className="celimax-faq-left__frame">
                  <img
                    src="./assets/people/hero-woman-glow.jpg"
                    alt="Rosto sereno com pele radiante e cuidada"
                    className="celimax-faq-left__img"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right Column: Accordion Stack */}
              <div className="celimax-faq-stack js-reveal-item">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <article
                      key={item.topic}
                      className={`celimax-faq-card ${isOpen ? 'celimax-faq-card--open' : ''}`}
                    >
                      <button
                        type="button"
                        className="celimax-faq-trigger"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <span className="celimax-faq-icon" aria-hidden="true">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="celimax-faq-body">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </article>
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
