import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { LILY_CENTER, RENOVARE_PETAL_PATHS } from '../three/renovareLogoPaths';

gsap.registerPlugin(CustomEase);

const EMIL_EASE_OUT = CustomEase.create('preloaderEaseOut', 'M0,0 C0.23,1 0.32,1 1,1');
const EMIL_EASE_IN_OUT = CustomEase.create('preloaderEaseInOut', 'M0,0 C0.77,0 0.175,1 1,1');

interface LilyPreloaderProps {
  onComplete: () => void;
}

export const LilyPreloader: React.FC<LilyPreloaderProps> = ({ onComplete }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const overlay = overlayRef.current;
    const svg = svgRef.current;
    if (!overlay || !svg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(() => {
        onCompleteRef.current();
      }, 280);
      return () => window.clearTimeout(quickTimer);
    }

    const strokePaths = svg.querySelectorAll<SVGPathElement>('.js-petal-stroke');
    const fillPaths = svg.querySelectorAll<SVGPathElement>('.js-petal-fill');

    // Measure exact path lengths for SVG construction animation
    strokePaths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    gsap.set(fillPaths, {
      autoAlpha: 0,
      scale: 0.9,
      rotation: -12,
      svgOrigin: `${LILY_CENTER.x} ${LILY_CENTER.y}`,
    });

    const tl = gsap.timeline({
      defaults: { ease: EMIL_EASE_OUT },
      onComplete: () => {
        onCompleteRef.current();
      },
    });

    tl.addLabel('buildStart', 0);

    // 1. Bottom screen-edge progress bar fills smoothly across the viewport width
    if (progressFillRef.current) {
      tl.fromTo(
        progressFillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.45, ease: EMIL_EASE_IN_OUT },
        'buildStart'
      );
    }

    // 2. Construct the 8 SVG petals in the center: stroke traces first, then fill blooms in
    tl.to(
      strokePaths,
      {
        strokeDashoffset: 0,
        duration: 0.85,
        stagger: 0.055,
        ease: EMIL_EASE_IN_OUT,
      },
      'buildStart'
    )
      .to(
        fillPaths,
        {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          duration: 0.65,
          stagger: 0.055,
          ease: EMIL_EASE_OUT,
        },
        'buildStart+=0.32'
      )
      .to(
        strokePaths,
        {
          autoAlpha: 0,
          duration: 0.35,
        },
        'buildStart+=1.05'
      );

    // 3. Dissolve preloader smoothly into the page
    tl.to(
      overlay,
      {
        autoAlpha: 0,
        scale: 1.02,
        filter: 'blur(6px)',
        duration: 0.42,
        ease: EMIL_EASE_IN_OUT,
      },
      'buildStart+=1.45'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="lily-preloader"
      role="status"
      aria-live="polite"
      aria-label="Carregando experiência Renovare"
    >
      <div className="lily-preloader__center">
        <svg
          ref={svgRef}
          viewBox="186 0 246 244"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="lily-preloader__svg"
          aria-hidden="true"
        >
          {RENOVARE_PETAL_PATHS.map((p) => {
            const combinedD = `${p.outerPath} ${p.holePath}`;
            return (
              <g key={p.id}>
                <path
                  d={combinedD}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#DBE4A9"
                  className="js-petal-fill"
                />
                <path
                  d={combinedD}
                  fill="none"
                  stroke="#DBE4A9"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="js-petal-stroke"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom full-width loading bar anchored at the base of the screen */}
      <div className="lily-preloader__bottom-bar" aria-hidden="true">
        <div ref={progressFillRef} className="lily-preloader__bottom-bar-fill" />
      </div>
    </div>
  );
};
