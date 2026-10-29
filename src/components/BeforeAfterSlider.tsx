import React, { useState, useRef, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
  category: string;
  description: string;
  initialPosition?: number; // 0 to 100
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Condição antes do protocolo',
  afterAlt = 'Resultado após o protocolo',
  beforeLabel = 'Antes',
  afterLabel = 'Depois',
  title,
  category,
  description,
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  return (
    <div className="celimax-ba-card">
      <div
        ref={containerRef}
        className={`celimax-ba-visual ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        tabIndex={0}
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Comparação de antes e depois: ${title}`}
        onKeyDown={handleKeyDown}
      >
        {/* Base: After Image (revealed on the right) */}
        <img
          src={afterImage}
          alt={afterAlt}
          className="celimax-ba-img celimax-ba-img--after"
          loading="lazy"
          draggable={false}
        />

        {/* Clipped: Before Image (revealed on the left) */}
        <div
          className="celimax-ba-clip"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeAlt}
            className="celimax-ba-img celimax-ba-img--before"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Labels */}
        <span
          className="celimax-ba-tag celimax-ba-tag--before"
          style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
        >
          {beforeLabel}
        </span>
        <span
          className="celimax-ba-tag celimax-ba-tag--after"
          style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
        >
          {afterLabel}
        </span>

        {/* Divider & Draggable Handle */}
        <div
          className="celimax-ba-handle-line"
          style={{ left: `${sliderPosition}%` }}
          aria-hidden="true"
        >
          <div className="celimax-ba-handle-pill">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="celimax-ba-meta">
        <span className="celimax-ba-category">{category}</span>
        <h3 className="celimax-ba-title">{title}</h3>
        <p className="celimax-ba-desc">{description}</p>
      </div>
    </div>
  );
}
