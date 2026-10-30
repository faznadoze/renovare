import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TAU = Math.PI * 2;
/** One full lap; slow enough to read a card as it drifts past */
const REVOLUTION_SECONDS = 46;
/** Depth range: cards shrink and dim as they travel behind the lily */
const BACK_SCALE = 0.8;
const BACK_OPACITY = 0.5;

/**
 * Continuous elliptical orbit for the review cards around the lily.
 * Cards pop in at their orbit positions, then the orbit eases up from rest.
 * Must be created inside a gsap context/matchMedia so tweens and triggers revert with it.
 */
export function createReviewOrbit(stage: HTMLElement, cards: HTMLElement[]) {
  const count = cards.length;
  const geometry = { rx: 0, ry: 0 };
  const state = { angle: -Math.PI / 2 + Math.PI / count, speed: 0, hover: 1 };
  const intro = cards.map(() => ({ scale: 0, opacity: 0 }));
  const setters = cards.map((card) => ({
    x: gsap.quickSetter(card, 'x', 'px'),
    y: gsap.quickSetter(card, 'y', 'px'),
    scale: gsap.quickSetter(card, 'scale'),
    opacity: gsap.quickSetter(card, 'opacity'),
  }));

  const measure = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const card = cards[0];
    geometry.rx = width / 2 - card.offsetWidth / 2 + Math.min(48, width * 0.04);
    geometry.ry = height / 2 - card.offsetHeight / 2 - 4;
  };

  const render = () => {
    for (let i = 0; i < count; i += 1) {
      const theta = state.angle + (i * TAU) / count;
      const sin = Math.sin(theta);
      const depth = (sin + 1) / 2; // 0 = far (top), 1 = near (bottom)
      const pop = intro[i];
      setters[i].x(Math.cos(theta) * geometry.rx);
      setters[i].y(sin * geometry.ry + (1 - pop.scale) * 18);
      setters[i].scale((BACK_SCALE + (1 - BACK_SCALE) * depth) * (0.9 + 0.1 * pop.scale));
      setters[i].opacity((BACK_OPACITY + (1 - BACK_OPACITY) * depth) * pop.opacity);
      cards[i].style.zIndex = String(Math.round(depth * 100) + 1);
    }
  };

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 50) / 1000; // no jump after a background tab
    state.angle += (state.speed * state.hover * dt * TAU) / REVOLUTION_SECONDS;
    render();
  };

  stage.classList.add('is-orbiting');
  gsap.set(cards, { xPercent: -50, yPercent: -50, visibility: 'visible' });
  measure();
  render();

  // Only spend frames while the stage is on screen
  ScrollTrigger.create({
    trigger: stage,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
  });

  // Entry: cards pop in (random order), then the orbit accelerates gently from rest
  ScrollTrigger.create({
    trigger: stage,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const order = gsap.utils.shuffle(intro.map((_, i) => i));
      const entry = gsap.timeline({
        onUpdate: render,
        onComplete: () => {
          gsap.to(state, { speed: 1, duration: 2.8, ease: 'power2.inOut' });
        },
      });
      order.forEach((cardIndex, step) => {
        const at = step * 0.11;
        entry
          .to(intro[cardIndex], { scale: 1, duration: 0.62, ease: 'back.out(1.5)' }, at)
          .to(intro[cardIndex], { opacity: 1, duration: 0.42, ease: 'power1.out' }, at);
      });
    },
  });

  // Hovering the stage glides the orbit to a stop so a review can be read
  const slowDown = () => gsap.to(state, { hover: 0, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
  const resume = () => gsap.to(state, { hover: 1, duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' });
  const onResize = () => {
    measure();
    render();
  };
  stage.addEventListener('mouseenter', slowDown);
  stage.addEventListener('mouseleave', resume);
  window.addEventListener('resize', onResize);

  return () => {
    gsap.ticker.remove(tick);
    stage.removeEventListener('mouseenter', slowDown);
    stage.removeEventListener('mouseleave', resume);
    window.removeEventListener('resize', onResize);
    stage.classList.remove('is-orbiting');
    cards.forEach((card) => card.style.removeProperty('z-index'));
    gsap.set(cards, { clearProps: 'transform,opacity,visibility' });
  };
}
