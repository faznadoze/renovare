import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
 * Smooth ("delayed") scroll for mouse and trackpad: the page follows the wheel with a short,
 * damped lag, so pinned stories and scrubbed scenes read as one continuous motion.
 * Touch keeps native scrolling (it already has momentum and stays the fastest path), and
 * reduced-motion users keep the browser's own scroll.
 */
let lenis: Lenis | null = null;

export function shouldSmoothScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Starts Lenis on GSAP's ticker; held still until `startDelayMs` (the loading screen). */
export function startSmoothScroll(startDelayMs = 0): () => void {
  if (!shouldSmoothScroll()) return () => {};

  const instance = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.9,
    // In-page links (#manifesto, #faq…) glide and clear the fixed header
    anchors: { offset: -80 },
  });
  lenis = instance;

  instance.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  instance.stop();
  const startTimer = window.setTimeout(() => {
    instance.start();
    ScrollTrigger.refresh();
  }, startDelayMs);

  return () => {
    window.clearTimeout(startTimer);
    gsap.ticker.remove(tick);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

/** Scrolls the page through Lenis when it runs, natively otherwise. */
export function scrollPageTo(top: number) {
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.1 });
    return;
  }
  window.scrollTo({
    top,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * ScrollTrigger's own snap tweens the window and fights Lenis' inertia. With smooth scroll,
 * settle on the nearest stop once scrolling ends, through Lenis.
 */
export function snapThroughLenis(trigger: ScrollTrigger, stops: () => number[]): () => void {
  const onScrollEnd = () => {
    if (!lenis || !trigger.isActive) return;
    const points = stops();
    if (!points.length) return;
    const progress = trigger.progress;
    const nearest = points.reduce((best, point) =>
      Math.abs(point - progress) < Math.abs(best - progress) ? point : best
    );
    if (Math.abs(nearest - progress) < 0.002) return;
    lenis.scrollTo(trigger.start + (trigger.end - trigger.start) * nearest, {
      duration: 0.7,
      easing: easeOutCubic,
    });
  };
  ScrollTrigger.addEventListener('scrollEnd', onScrollEnd);
  return () => ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd);
}

/** Holds the page still (Lenis and native scroll) while a full-screen layer is open. */
export function setPageScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (locked) lenis?.stop();
  else lenis?.start();
}
