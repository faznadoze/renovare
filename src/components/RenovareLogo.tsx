import React from 'react';
import { RENOVARE_PETAL_PATHS, RENOVARE_WORDMARK_PATHS } from '../three/renovareLogoPaths';

interface RenovareLogoProps {
  variant?: 'full' | 'wordmark' | 'symbol';
  color?: string;
  className?: string;
  ariaLabel?: string;
}

export const RenovareLogo: React.FC<RenovareLogoProps> = ({
  variant = 'full',
  color = 'currentColor',
  className = '',
  ariaLabel = 'Renovare',
}) => {
  if (variant === 'wordmark') {
    return (
      <svg
        viewBox="0 278 616 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        {RENOVARE_WORDMARK_PATHS.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </svg>
    );
  }

  if (variant === 'symbol') {
    return (
      <svg
        viewBox="186 0 246 244"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={ariaLabel}
      >
        {RENOVARE_PETAL_PATHS.map((p) => (
          <path
            key={p.id}
            d={`${p.outerPath} ${p.holePath}`}
            fillRule="evenodd"
            clipRule="evenodd"
            fill={color}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 616 375"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {RENOVARE_WORDMARK_PATHS.map((d, i) => (
        <path key={`w-${i}`} d={d} fill={color} />
      ))}
      {RENOVARE_PETAL_PATHS.map((p) => (
        <path
          key={p.id}
          d={`${p.outerPath} ${p.holePath}`}
          fillRule="evenodd"
          clipRule="evenodd"
          fill={color}
        />
      ))}
    </svg>
  );
};
