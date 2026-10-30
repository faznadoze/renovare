import React, { useEffect, useState } from 'react';
import { RenovareLogo } from './RenovareLogo';

export const LOADING_DURATION_MS = 3000;
const EXIT_DURATION_MS = 520;

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('is-loading');

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
      root.classList.remove('is-loading');
      onComplete?.();
    }, LOADING_DURATION_MS);
    const unmountTimer = window.setTimeout(
      () => setIsMounted(false),
      LOADING_DURATION_MS + EXIT_DURATION_MS
    );

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
      root.classList.remove('is-loading');
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`renovare-loader ${isExiting ? 'renovare-loader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando Renovare"
    >
      <div className="renovare-loader__mark" aria-hidden="true">
        <span className="renovare-loader__halo" />
        <RenovareLogo variant="symbol" color="currentColor" className="renovare-loader__symbol" />
      </div>

      <div className="renovare-loader__track" aria-hidden="true">
        <span className="renovare-loader__bar" />
      </div>
    </div>
  );
}
