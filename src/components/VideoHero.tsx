import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Drop the encoded files here (see the brief in chat): 16:9 desktop and 9:16 phone cuts,
// no audio track, faststart. Posters are the first frame; until the video exists they
// carry a clinic photograph.
const HERO_MEDIA = {
  desktop: {
    poster: './assets/hero/hero-poster.webp',
    sources: [
      { src: './assets/hero/hero-desktop.webm', type: 'video/webm' },
      { src: './assets/hero/hero-desktop.mp4', type: 'video/mp4' },
    ],
  },
  mobile: {
    poster: './assets/hero/hero-poster-mobile.webp',
    sources: [
      { src: './assets/hero/hero-mobile.webm', type: 'video/webm' },
      { src: './assets/hero/hero-mobile.mp4', type: 'video/mp4' },
    ],
  },
};

const PHONE_QUERY = '(max-width: 720px)';

// The second line of the headline turns every few seconds
const HERO_PHRASES = ['se sentir bem', 'ser valorizada', 'todo cuidado'];
const PHRASE_INTERVAL_MS = 5000;

interface VideoHeroProps {
  /** Seconds before the headline starts (the loading screen) */
  introDelay: number;
}

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

/**
 * Full-bleed video hero. While the page scrolls away the frame insets a little and rounds
 * its corners, revealing the next section's colour behind it. Only the headline sits on it.
 */
export function VideoHero({ introDelay }: VideoHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(PHONE_QUERY).matches : false
  );
  const [canPlay, setCanPlay] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [phrase, setPhrase] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });

  // Second line rotates every 5s once the intro has played
  useEffect(() => {
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setPhrase(({ index }) => ({ index: (index + 1) % HERO_PHRASES.length, previous: index }));
      }, PHRASE_INTERVAL_MS);
    }, introDelay * 1000);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [introDelay]);

  // Motion and data preferences decide whether the video runs at all; the poster stays
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean((navigator as SaveDataNavigator).connection?.saveData);
    setCanPlay(!reduce && !saveData);

    const phone = window.matchMedia(PHONE_QUERY);
    const onChange = () => setIsPhone(phone.matches);
    phone.addEventListener('change', onChange);
    return () => phone.removeEventListener('change', onChange);
  }, []);

  // Play only while the hero is on screen
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !canPlay || videoFailed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [canPlay, videoFailed, isPhone]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The two headline lines arrive one after the other
        gsap.from('.video-hero__title-row', {
          yPercent: 60,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.16,
          delay: introDelay,
        });

        gsap.fromTo(
          '.video-hero__media',
          { scale: 1.06 },
          { scale: 1, duration: 1.6, ease: 'power2.out', delay: Math.max(0, introDelay - 0.3) }
        );

        // As the hero scrolls away the frame insets just enough for margins and rounds its corners
        gsap.fromTo(
          '.video-hero__frame',
          { '--hero-inset': '0px', '--hero-radius': '0px' },
          {
            '--hero-inset': () => (window.matchMedia(PHONE_QUERY).matches ? '12px' : '28px'),
            '--hero-radius': () => (window.matchMedia(PHONE_QUERY).matches ? '22px' : '32px'),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '45% top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const media = isPhone ? HERO_MEDIA.mobile : HERO_MEDIA.desktop;
  const showVideo = canPlay && !videoFailed;

  return (
    <section ref={sectionRef} className="video-hero" aria-label="Renovare Betim">
      <div className="video-hero__frame">
        <div className="video-hero__media">
          <img className="video-hero__poster" src={media.poster} alt="" fetchPriority="high" />
          {showVideo && (
            <video
              key={isPhone ? 'mobile' : 'desktop'}
              ref={videoRef}
              className="video-hero__video"
              poster={media.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden="true"
              onError={() => setVideoFailed(true)}
            >
              {media.sources.map((source) => (
                <source
                  key={source.src}
                  src={source.src}
                  type={source.type}
                  onError={(event) => {
                    // The last source failing means no playable file: keep the poster
                    const parent = event.currentTarget.parentElement;
                    if (parent && event.currentTarget === parent.lastElementChild) setVideoFailed(true);
                  }}
                />
              ))}
            </video>
          )}
        </div>
        <div className="video-hero__scrim" aria-hidden="true" />

        <div className="video-hero__content">
          <h1 className="video-hero__title">
            {/* Read once in full; the turning line is visual only */}
            <span className="sr-only">Você merece {HERO_PHRASES.slice(0, -1).join(', ')} e {HERO_PHRASES.at(-1)}</span>
            <span className="video-hero__title-row video-hero__title-line" aria-hidden="true">
              Você merece
            </span>
            <span className="video-hero__title-row video-hero__rotator" aria-hidden="true">
              {HERO_PHRASES.map((text, idx) => (
                <span
                  key={text}
                  className={`video-hero__phrase ${idx === phrase.index ? 'is-active' : ''} ${
                    idx === phrase.previous ? 'is-leaving' : ''
                  }`}
                >
                  {text}
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
