import React, { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_SHARE_URL } from '../data/renovareContent';

interface FloatingGoogleReviewsProps {
  /** Trigger the 4-second entrance cascade once the preloader completes */
  active: boolean;
}

interface CardSlotMeta {
  side: 'left' | 'right';
  rankIndex: number;
  offsetX: number;
  startDelay: number;
  duration: number;
  riseDistance: number;
  driftX: number;
  tiltDeg: number;
}

function GoogleMarkSvg() {
  return (
    <svg
      className="floating-review-card__google-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FiveStarRowSvg() {
  return (
    <div className="floating-review-card__stars" aria-label="Avaliação 5 de 5 estrelas no Google">
      {[0, 1, 2, 3, 4].map((starIdx) => (
        <svg
          key={starIdx}
          className="floating-review-card__star-svg"
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 1.333 10.06 5.51l4.607.673-3.334 3.247.787 4.587L8 11.853l-4.12 2.164.787-4.587L1.333 6.183l4.607-.673L8 1.333Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

export function FloatingGoogleReviews({ active }: FloatingGoogleReviewsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  // Generate randomized upward motion parameters once per page entry
  // Increased entrance interval between cards (~420ms stagger) & wider X-axis separation
  const cardMetaList = useMemo<CardSlotMeta[]>(() => {
    return GOOGLE_REVIEWS.map((_, index) => {
      const side: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';
      const rankIndex = Math.floor(index / 2); // 0..4 from top to bottom
      const randomSeedA = Math.random();
      const randomSeedB = Math.random();
      const randomSeedC = Math.random();

      // Increased entrance interval between cards (~420ms stagger + subtle organic jitter)
      const startDelay = Number((index * 0.42 + (randomSeedB - 0.5) * 0.08).toFixed(3));
      // Float lifecycle per card (~4.2s so each card has ample display and reading time)
      const duration = Number((4.2 + (randomSeedC - 0.5) * 0.5).toFixed(3));

      // Separate further on X axis: bias outwards towards screen margins
      const sideBiasX = side === 'left' ? -22 : 22;
      const offsetX = Number((sideBiasX + (randomSeedA - 0.5) * 20).toFixed(1));
      const driftX = Number(((side === 'left' ? -1 : 1) * (8 + randomSeedA * 10)).toFixed(1));

      return {
        side,
        rankIndex,
        offsetX,
        startDelay,
        duration,
        riseDistance: Math.round(140 + randomSeedC * 90),
        driftX,
        tiltDeg: Number(((randomSeedB - 0.5) * 1.6).toFixed(2)),
      };
    });
  }, []);

  useGSAP(
    () => {
      if (!active || !isVisible || !containerRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cards = gsap.utils.toArray<HTMLElement>('.js-floating-review-card');
      if (cards.length === 0) return;

      if (prefersReducedMotion) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            delay: 2.0,
            duration: 0.35,
            stagger: 0.3,
            onComplete: () => {
              gsap.to(cards, {
                autoAlpha: 0,
                delay: 4.0,
                duration: 0.35,
                onComplete: () => setIsVisible(false),
              });
            },
          }
        );
        return;
      }

      // Floating choreography with 2.0s initial delay, individual staggered entrances,
      // and wider lateral separation framing the hero
      const masterTl = gsap.timeline({
        delay: 2.0,
        onComplete: () => setIsVisible(false),
      });

      cards.forEach((card, index) => {
        const meta = cardMetaList[index];
        const fadeOutDuration = 0.75;
        const fadeOutStart = Number((meta.startDelay + meta.duration - fadeOutDuration).toFixed(3));

        gsap.set(card, {
          autoAlpha: 0,
          y: 56,
          x: meta.offsetX,
          rotate: meta.tiltDeg,
          scale: 0.96,
        });

        // Continuous upward rise across each card's full duration
        masterTl.to(
          card,
          {
            y: -meta.riseDistance,
            x: meta.offsetX + meta.driftX,
            rotate: 0,
            duration: meta.duration,
            ease: 'power1.out',
          },
          meta.startDelay
        );

        // Crisp entrance reveal
        masterTl.to(
          card,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
          },
          meta.startDelay
        );

        // Graceful upward exit after full display lifecycle
        masterTl.to(
          card,
          {
            autoAlpha: 0,
            scale: 0.97,
            duration: fadeOutDuration,
            ease: 'power2.in',
          },
          fadeOutStart
        );
      });
    },
    { dependencies: [active, isVisible, cardMetaList], scope: containerRef }
  );

  if (!active || !isVisible) return null;

  const leftColumnReviews = GOOGLE_REVIEWS.map((review, index) => ({
    review,
    index,
    meta: cardMetaList[index],
  })).filter((item) => item.meta.side === 'left');

  const rightColumnReviews = GOOGLE_REVIEWS.map((review, index) => ({
    review,
    index,
    meta: cardMetaList[index],
  })).filter((item) => item.meta.side === 'right');

  return (
    <aside
      ref={containerRef}
      className="floating-reviews-stage"
      aria-label="10 avaliações mais recentes da Renovare no Google"
    >
      <div className="floating-reviews-stage__grid">
        <div className="floating-reviews-stage__column floating-reviews-stage__column--left">
          {leftColumnReviews.map(({ review, index }) => (
            <article
              key={review.id}
              className="floating-review-card js-floating-review-card"
              data-rank={index + 1}
            >
              <header className="floating-review-card__header">
                <div className="floating-review-card__identity">
                  {failedAvatars[review.id] ? (
                    <span className="floating-review-card__avatar-fallback" aria-hidden="true">
                      {review.initials}
                    </span>
                  ) : (
                    <img
                      src={review.avatarUrl}
                      alt=""
                      width="32"
                      height="32"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      className="floating-review-card__avatar"
                      onError={() =>
                        setFailedAvatars((prev) => ({
                          ...prev,
                          [review.id]: true,
                        }))
                      }
                    />
                  )}
                  <div className="floating-review-card__author-block">
                    <span className="floating-review-card__author">{review.author}</span>
                    <div className="floating-review-card__meta">
                      <FiveStarRowSvg />
                      <span className="floating-review-card__dot" aria-hidden="true">
                        ·
                      </span>
                      <span className="floating-review-card__time">{review.relativeTime}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={GOOGLE_REVIEWS_SHARE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floating-review-card__source"
                  aria-label={`Ver avaliação de ${review.author} no Google`}
                >
                  <GoogleMarkSvg />
                </a>
              </header>
              <p className="floating-review-card__comment">“{review.comment}”</p>
            </article>
          ))}
        </div>

        <div className="floating-reviews-stage__column floating-reviews-stage__column--right">
          {rightColumnReviews.map(({ review, index }) => (
            <article
              key={review.id}
              className="floating-review-card js-floating-review-card"
              data-rank={index + 1}
            >
              <header className="floating-review-card__header">
                <div className="floating-review-card__identity">
                  {failedAvatars[review.id] ? (
                    <span className="floating-review-card__avatar-fallback" aria-hidden="true">
                      {review.initials}
                    </span>
                  ) : (
                    <img
                      src={review.avatarUrl}
                      alt=""
                      width="32"
                      height="32"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      className="floating-review-card__avatar"
                      onError={() =>
                        setFailedAvatars((prev) => ({
                          ...prev,
                          [review.id]: true,
                        }))
                      }
                    />
                  )}
                  <div className="floating-review-card__author-block">
                    <span className="floating-review-card__author">{review.author}</span>
                    <div className="floating-review-card__meta">
                      <FiveStarRowSvg />
                      <span className="floating-review-card__dot" aria-hidden="true">
                        ·
                      </span>
                      <span className="floating-review-card__time">{review.relativeTime}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={GOOGLE_REVIEWS_SHARE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floating-review-card__source"
                  aria-label={`Ver avaliação de ${review.author} no Google`}
                >
                  <GoogleMarkSvg />
                </a>
              </header>
              <p className="floating-review-card__comment">“{review.comment}”</p>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
