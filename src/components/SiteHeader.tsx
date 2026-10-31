import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { setPageScrollLocked } from '../animations/smoothScroll';
import { RenovareLogo } from './RenovareLogo';
import { buildWhatsAppUrl } from '../data/renovareContent';

/*
 * Header modelled on lassie.ai: floating glass pills holding white rounded chips. Desktop
 * has a centre pill (mark + wordmark + section links) and a right pill with the booking
 * action; hovering a chip dims all the others. Scrolling down past 400px
 * folds the wordmark away; scrolling up (or back above 360px, or hovering) unfolds it.
 * Phones show one pill: mark (+ wordmark until scrolled) and MENU, which opens a
 * full-screen sheet of centred section links and the booking pill; MENU morphs into an X.
 */

// Section links in page order; BLACK (the campaign) is set in gold
const SECTIONS = [
  { href: '#black-renovare', label: 'BLACK', gold: true },
  { href: '#procedimentos', label: 'Protocolos' },
  { href: '#antes-depois', label: 'Antes & Depois' },
  { href: '#diferenciais', label: 'Avaliações' },
  { href: '#especialistas', label: 'Especialistas' },
  { href: '#faq', label: 'Dúvidas' },
];

const MOBILE_SECTIONS = [
  { href: '#black-renovare', label: 'BLACK', gold: true },
  { href: '#procedimentos', label: 'Protocolos' },
  { href: '#antes-depois', label: 'Antes & Depois' },
  { href: '#diferenciais', label: 'Avaliações' },
  { href: '#especialistas', label: 'Especialistas' },
  { href: '#faq', label: 'Dúvidas frequentes' },
];

const BOOKING_URL = buildWhatsAppUrl(
  'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação estética personalizada em Betim.'
);

// Wordmark (75px) plus its 6px gap from the mark; both fold away together
const WORDMARK_WIDTH = 81;
const FOLD = { duration: 0.45, ease: 'power3.inOut' };

// Phone sheet unrolls from the top; its leading edge is rounded while it travels. The clip
// is written from a 0–1 progress because browsers shorten inset() strings, which breaks
// GSAP's string interpolation.
function sheetClip(progress: number) {
  const radius = 40 * (1 - progress);
  return `inset(0px 0px ${(1 - progress) * 100}% 0px round 0px 0px ${radius}px ${radius}px)`;
}

function useCollapsedOnScroll() {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    setCollapsed(last >= 400);
    const onScroll = () => {
      const y = window.scrollY;
      const goingUp = y < last;
      last = y;
      if (goingUp || y <= 360) setCollapsed(false);
      else if (y >= 400) setCollapsed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return [collapsed, setCollapsed] as const;
}

export function SiteHeader() {
  const [collapsed, setCollapsed] = useCollapsedOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  const wordmarkRef = useRef<HTMLSpanElement>(null);

  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileWordmarkRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const sheet = useRef({ progress: 0 });
  const collapsedRef = useRef(collapsed);
  collapsedRef.current = collapsed;

  // Fold / unfold the wordmark
  useEffect(() => {
    const folded = collapsed && !menuOpen;
    const targets = [wordmarkRef.current, mobileWordmarkRef.current].filter(Boolean);
    gsap.to(targets, {
      width: folded ? 0 : WORDMARK_WIDTH,
      opacity: folded ? 0 : 1,
      ...FOLD,
    });
  }, [collapsed, menuOpen]);

  // Phone menu: a full-screen sheet unrolls from the top while the pill stretches to the
  // screen edges; links rise in after it. Closing reverses, a touch quicker. Every move
  // eases in and out, and each toggle starts from wherever the last one left off.
  useEffect(() => {
    const panel = panelRef.current;
    const mobileNav = mobileNavRef.current;
    const wordmark = mobileWordmarkRef.current;
    if (!panel || !mobileNav) return;
    const hidden = getComputedStyle(panel).display === 'none';
    if (!menuOpen && hidden) return;

    const items = panel.querySelectorAll('.site-header__panel-item');
    const drawSheet = () => {
      panel.style.clipPath = sheetClip(sheet.current.progress);
    };
    menuTimeline.current?.kill();
    setPageScrollLocked(menuOpen);

    if (menuOpen) {
      if (hidden) {
        sheet.current.progress = 0;
        drawSheet();
        gsap.set(panel, { display: 'block' });
        gsap.set(items, { y: 28, opacity: 0 });
      }
      menuTimeline.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(sheet.current, { progress: 1, duration: 0.62, onUpdate: drawSheet }, 0)
        .to(
          mobileNav,
          {
            width: document.documentElement.clientWidth - 32,
            duration: 0.62,
            onComplete: () => gsap.set(mobileNav, { width: 'calc(100vw - 32px)' }),
          },
          0
        )
        .to(items, { y: 0, opacity: 1, duration: 0.56, stagger: 0.045, clearProps: 'transform' }, 0.2);
    } else {
      // Measure the pill's resting width with the wordmark at its final state
      const from = mobileNav.offsetWidth;
      const wordmarkNow = wordmark?.offsetWidth ?? 0;
      gsap.set(mobileNav, { clearProps: 'width' });
      if (wordmark) gsap.set(wordmark, { width: collapsedRef.current ? 0 : WORDMARK_WIDTH });
      const to = mobileNav.offsetWidth;
      if (wordmark) gsap.set(wordmark, { width: wordmarkNow });
      gsap.set(mobileNav, { width: from });

      menuTimeline.current = gsap
        .timeline({
          defaults: { ease: 'power3.inOut' },
          onComplete: () => {
            gsap.set(panel, { display: 'none' });
            gsap.set(mobileNav, { clearProps: 'width' });
          },
        })
        .to(items, { y: -12, opacity: 0, duration: 0.28, ease: 'power2.inOut', stagger: { each: 0.02, from: 'end' } }, 0)
        .to(sheet.current, { progress: 0, duration: 0.5, onUpdate: drawSheet }, 0.12)
        .to(mobileNav, { width: to, duration: 0.5 }, 0.12);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) menuTimeline.current.progress(1);
  }, [menuOpen]);

  // Release the page if the header unmounts mid-menu
  useEffect(() => () => setPageScrollLocked(false), []);

  // Widening past the phone layout closes the menu (the desktop pills take over)
  useEffect(() => {
    if (!menuOpen) return;
    const wide = window.matchMedia('(min-width: 1280px)');
    const onChange = () => wide.matches && setMenuOpen(false);
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, [menuOpen]);

  // Escape closes the phone menu and returns focus to its button
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={`site-header ${menuOpen ? 'site-header--menu-open' : ''}`}>
      {/* Desktop: centre pill */}
      <nav
        className="site-header__pill site-header__pill--main"
        aria-label="Navegação principal"
        onMouseEnter={() => setCollapsed(false)}
      >
        <span className="site-header__frame" aria-hidden="true" />
        <a href="#topo" className="site-header__item site-header__item--brand" aria-label="Renovare — início">
          <RenovareLogo variant="symbol" color="currentColor" className="site-header__symbol" />
          <span ref={wordmarkRef} className="site-header__wordmark" aria-hidden="true">
            <RenovareLogo variant="wordmark" color="currentColor" className="site-header__wordmark-svg" />
          </span>
        </a>
        {SECTIONS.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className={`site-header__item ${section.gold ? 'site-header__item--gold' : ''}`}
          >
            {section.label}
          </a>
        ))}
      </nav>

      {/* Desktop: action pill */}
      <div className="site-header__pill site-header__pill--action">
        <span className="site-header__frame" aria-hidden="true" />
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="site-header__item site-header__item--cta">
          Agendar avaliação
        </a>
      </div>

      {/* Phones: full-screen sheet, outside the pill so `position: fixed` spans the viewport */}
      <div id="site-header-panel" ref={panelRef} className="site-header__panel">
        <div className="site-header__panel-inner">
          <div className="site-header__panel-links">
            {MOBILE_SECTIONS.map((section) => (
              <a
                key={section.href}
                href={section.href}
                className={`site-header__panel-item site-header__panel-link ${
                  section.gold ? 'site-header__panel-link--gold' : ''
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {section.label}
              </a>
            ))}
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="celimax-ba__btn-whatsapp celimax-ba__btn-whatsapp--results site-header__panel-item site-header__panel-cta"
            onClick={() => setMenuOpen(false)}
          >
            <span className="site-header__panel-cta-label">Agendar avaliação</span>
            <span className="celimax-ba__arrow-badge" aria-hidden="true">
              <img src="./assets/c256d.svg" alt="" width={22.4} height={22.4} />
            </span>
          </a>
        </div>
      </div>

      {/* Phones: mark + MENU, opening the sheet */}
      <nav
        ref={mobileNavRef}
        className={`site-header__mobile ${menuOpen ? 'is-open' : ''}`}
        aria-label="Navegação principal (celular)"
      >
        <span className="site-header__frame site-header__frame--mobile" aria-hidden="true" />
        <div className="site-header__mobile-row">
          <a
            href="#topo"
            className="site-header__item site-header__item--brand"
            aria-label="Renovare — início"
            onClick={() => setMenuOpen(false)}
          >
            <RenovareLogo variant="symbol" color="currentColor" className="site-header__symbol" />
            <span ref={mobileWordmarkRef} className="site-header__wordmark" aria-hidden="true">
              <RenovareLogo variant="wordmark" color="currentColor" className="site-header__wordmark-svg" />
            </span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="site-header__item site-header__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-header-panel"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="site-header__menu-label" aria-hidden="true">MENU</span>
            <span className="site-header__menu-icon" aria-hidden="true">
              <X size={20} strokeWidth={1.75} />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
