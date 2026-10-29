import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createRenovareLilyModel, LilySculptRuntime } from '../three/createRenovareLilyModel';
import { RENOVARE_PETAL_PATHS } from '../three/renovareLogoPaths';

gsap.registerPlugin(ScrollTrigger);

interface HeroLilyCanvasProps {
  heroSectionRef: React.RefObject<HTMLElement | null>;
  activePetalIndex?: number;
}

export const HeroLilyCanvas: React.FC<HeroLilyCanvasProps> = ({
  heroSectionRef,
  activePetalIndex = -1,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<LilySculptRuntime | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (runtimeRef.current) {
      runtimeRef.current.activeHighlightIndex.value = activePetalIndex;
    }
  }, [activePetalIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.6);

    // Botanical lighting rig following Renovare guideline:
    // Key light in Pale Moss (#DBE4A9), fill in Polar White (#F8F7F7), rim in warm olive
    const ambientLight = new THREE.AmbientLight('#F8F7F7', 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#DBE4A9', 2.8);
    keyLight.position.set(4.5, 5.2, 6.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#DBE4A9', 1.9);
    rimLight.position.set(-5.0, -3.5, 3.0);
    scene.add(rimLight);

    const centerPointLight = new THREE.PointLight('#DBE4A9', 2.2, 8);
    centerPointLight.position.set(0, 0, 1.8);
    scene.add(centerPointLight);

    const lilyGroup = createRenovareLilyModel({
      reducedMotion: prefersReducedMotion,
      scale: 1.0,
    });
    scene.add(lilyGroup);

    const runtime = lilyGroup.userData.sculptRuntime as LilySculptRuntime;
    runtimeRef.current = runtime;

    // Initial unfolding ("desabrochar") animation on load via GSAP
    let bloomTween: gsap.core.Tween | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    if (!prefersReducedMotion) {
      runtime.bloomProgress.value = 0.04;
      bloomTween = gsap.to(runtime.bloomProgress, {
        value: 1,
        duration: 1.8,
        ease: 'expo.out',
        delay: 0.15,
      });

      if (heroSectionRef.current) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          onUpdate: (self) => {
            runtime.scrollProgress.value = self.progress;
          },
        });
      }
    } else {
      runtime.setBloom(1);
    }

    // Subtle pointer interaction
    const onPointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      runtime.pointerTarget.x = THREE.MathUtils.clamp(nx, -1, 1);
      runtime.pointerTarget.y = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const onPointerLeave = () => {
      runtime.pointerTarget.x = 0;
      runtime.pointerTarget.y = 0;
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;
      const elapsed = clock.getElapsedTime();
      if (lilyGroup.userData.tick) {
        lilyGroup.userData.tick(elapsed);
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      bloomTween?.kill();
      scrollTriggerInstance?.kill();
      runtime.dispose();
      renderer.dispose();
    };
  }, [heroSectionRef]);

  if (!webglSupported) {
    return (
      <div className="lily-fallback" aria-label="Símbolo do lírio Renovare">
        <svg viewBox="180 0 260 250" className="lily-fallback-svg" role="img">
          {RENOVARE_PETAL_PATHS.map((p) => (
            <path
              key={p.id}
              d={`${p.outerPath} ${p.holePath}`}
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#DBE4A9"
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="hero-lily-canvas"
      role="img"
      aria-label="Escultura 3D interativa do lírio de oito pétalas da Renovare desabrochando"
    />
  );
};
