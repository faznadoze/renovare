import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { RenovareLogo } from './RenovareLogo';
import { buildWhatsAppUrl } from '../data/renovareContent';

/*
 * Header modelled on lassie.ai: floating glass pills. Desktop has a centre pill (mark +
 * wordmark + section links) where a white highlight slides under the hovered item and
 * rests on the mark, and a right pill with the booking action. Scrolling down past 400px
 * folds the wordmark away; scrolling up (or back above 360px, or hovering) unfolds it.
 * Phones show one pill: mark (+ wordmark until scrolled) and MENU, which opens a panel
 * of section links.
 */

const SECTIONS = [
  { href: '#manifesto', label: 'Sobre' },
  { href: '#procedimentos', label: 'Protocolos' },
  { href: '#antes-depois', label: 'Antes & Depois' },
  { href: '#diferenciais', label: 'Avaliações' },
  { href: '#especialistas', label: 'Especialistas' },
];

const MOBILE_SECTIONS = [
  { href: '#manifesto', label: 'Sobre a Renovare' },
  { href: '#black-renovare', label: 'Black Renovare' },
  { href: '#procedimentos', label: 'Protocolos' },
  { href: '#antes-depois', label: 'Antes & Depois' },
  { href: '#diferenciais', label: 'Avaliações' },
  { href: '#especialistas', label: 'Especialistas' },
  { href: '#faq', label: 'Dúvidas frequentes' },
];

const BOOKING_URL = buildWhatsAppUrl(
  'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação estética personalizada em Betim.'
);

// Wordmark (75px) plus its 8px gap from the mark; both fold away together
const WORDMARK_WIDTH = 83;
const MOVE = { duration: 0.32, ease: 'power3.out' };
const FOLD = { duration: 0.45, ease: 'power3.inOut' };

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
  const [litIndex, setLitIndex] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const hoveredRef = useRef<number | null>(null);

  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileWordmarkRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Slide the white highlight under an item (index 0 is the mark)
  const moveHighlight = useCallback((index: number, animate = true) => {
    const item = itemRefs.current[index];
    const highlight = highlightRef.current;
    if (!item || !highlight) return;
    const props = { x: item.offsetLeft, width: item.offsetWidth };
    if (animate) gsap.to(highlight, { ...props, ...MOVE, overwrite: 'auto' });
    else gsap.set(highlight, props);
    setLitIndex(index);
  }, []);

  useLayoutEffect(() => {
    moveHighlight(0, false);
    const onResize = () => moveHighlight(hoveredRef.current ?? 0, false);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(() => moveHighlight(hoveredRef.current ?? 0, false));
    return () => window.removeEventListener('resize', onResize);
  }, [moveHighlight]);

  // Fold / unfold the wordmark; the highlight follows the mark's changing width
  useEffect(() => {
    const folded = collapsed && !menuOpen;
    const targets = [wordmarkRef.current, mobileWordmarkRef.current].filter(Boolean);
    gsap.to(targets, {
      width: folded ? 0 : WORDMARK_WIDTH,
      opacity: folded ? 0 : 1,
      ...FOLD,
      onUpdate: () => {
        if (hoveredRef.current === null) moveHighlight(0, false);
      },
    });
  }, [collapsed, menuOpen, moveHighlight]);

  // Phone panel: the pill widens to the screen and the panel grows from it; closing folds back faster
  useEffect(() => {
    const panel = panelRef.current;
    const mobileNav = mobileNavRef.current;
    if (!panel || !mobileNav) return;
    if (menuOpen) {
      gsap.fromTo(
        mobileNav,
        { width: mobileNav.offsetWidth },
        { width: window.innerWidth - 32, duration: 0.3, ease: 'power3.out' }
      );
      gsap.set(panel, { display: 'block' });
      gsap.fromTo(panel, { height: 0, opacity: 1 }, { height: 'auto', duration: 0.32, ease: 'power3.out' });
      gsap.fromTo(
        panel.querySelectorAll('.site-header__panel-item'),
        { x: '-12%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.03, delay: 0.06 }
      );
    } else {
      gsap.to(panel, {
        height: 0,
        duration: 0.26,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(panel, { display: 'none' });
          gsap.set(mobileNav, { clearProps: 'width' });
        },
      });
    }
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

  const onItemEnter = (index: number) => {
    hoveredRef.current = index;
    moveHighlight(index);
  };

  const onNavLeave = () => {
    hoveredRef.current = null;
    moveHighlight(0);
  };

  return (
    <header className="site-header">
      {/* Desktop: centre pill */}
      <nav
        ref={navRef}
        className="site-header__pill site-header__pill--main"
        aria-label="Navegação principal"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={onNavLeave}
      >
        <span className="site-header__frame" aria-hidden="true" />
        <span ref={highlightRef} className="site-header__highlight" aria-hidden="true" />
        <a
          ref={(node) => {
            itemRefs.current[0] = node;
          }}
          href="#topo"
          className={`site-header__item site-header__item--brand ${litIndex === 0 ? 'is-lit' : ''}`}
          aria-label="Renovare — início"
          onMouseEnter={() => onItemEnter(0)}
          onFocus={() => onItemEnter(0)}
        >
          <RenovareLogo variant="symbol" color="currentColor" className="site-header__symbol" />
          <span ref={wordmarkRef} className="site-header__wordmark" aria-hidden="true">
            <RenovareLogo variant="wordmark" color="currentColor" className="site-header__wordmark-svg" />
          </span>
        </a>
        {SECTIONS.map((section, idx) => (
          <a
            key={section.href}
            ref={(node) => {
              itemRefs.current[idx + 1] = node;
            }}
            href={section.href}
            className={`site-header__item ${litIndex === idx + 1 ? 'is-lit' : ''}`}
            onMouseEnter={() => onItemEnter(idx + 1)}
            onFocus={() => onItemEnter(idx + 1)}
            onBlur={onNavLeave}
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

      {/* Phones: mark + MENU, opening a panel of sections */}
      <nav
        ref={mobileNavRef}
        className={`site-header__mobile ${menuOpen ? 'is-open' : ''}`}
        aria-label="Navegação principal (celular)"
      >
        <span className="site-header__frame site-header__frame--mobile" aria-hidden="true" />
        <div className="site-header__mobile-row">
          <a
            href="#topo"
            className="site-header__item site-header__item--brand is-lit"
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
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'FECHAR' : 'MENU'}
          </button>
        </div>
        <div id="site-header-panel" ref={panelRef} className="site-header__panel">
          <div className="site-header__panel-inner">
            {MOBILE_SECTIONS.map((section) => (
              <a
                key={section.href}
                href={section.href}
                className="site-header__panel-item site-header__panel-link"
                onClick={() => setMenuOpen(false)}
              >
                {section.label}
              </a>
            ))}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-header__panel-item site-header__panel-cta"
              onClick={() => setMenuOpen(false)}
            >
              Agendar avaliação
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
