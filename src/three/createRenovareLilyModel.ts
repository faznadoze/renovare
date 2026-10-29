import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { LILY_CENTER, RENOVARE_PETAL_PATHS } from './renovareLogoPaths';

/**
 * Procedural Three.js factory following `img2threejs` architecture:
 * - Reconstructs the 8-petal rotational lily from `renovare-logo.svg` in pure code.
 * - Uses `SVGLoader` + `THREE.ExtrudeGeometry` with organic beveling and vertex-level
 *   botanical curvature (cupping + distal taper from base to tip).
 * - Exposes runtime hierarchy (`sculptRuntime`, `petalPivots`, `bloomState`, `userData.tick`)
 *   so GSAP and ScrollTrigger can choreograph the "unfolding" (desabrochar) and scroll rotation.
 */

export interface LilySculptRuntime {
  petalPivots: THREE.Group[];
  petalMeshes: THREE.Mesh[];
  coreGroup: THREE.Group;
  bloomProgress: { value: number };
  scrollProgress: { value: number };
  pointerTarget: { x: number; y: number };
  activeHighlightIndex: { value: number };
  setBloom: (progress: number) => void;
  dispose: () => void;
}

export interface CreateLilyOptions {
  reducedMotion?: boolean;
  scale?: number;
}

function createBotanicalRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 256, 256);
    // Subtle organic botanical vein striation
    for (let i = 0; i < 180; i++) {
      const y = (i / 180) * 256;
      const alpha = 0.04 + ((i * 29) % 10) * 0.008;
      ctx.strokeStyle = i % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(30,30,30,${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(85, y - 6, 170, y + 6, 256, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(0.04, 0.04);
  return tex;
}

export function createRenovareLilyModel(options: CreateLilyOptions = {}): THREE.Group {
  const root = new THREE.Group();
  root.name = 'renovare-lily-root';

  const loader = new SVGLoader();
  const roughnessMap = createBotanicalRoughnessTexture();

  // Primary Botanical Satin Olive Material (lit by Pale Moss #DBE4A9 lights)
  const petalBaseMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#576E44'),
    emissive: new THREE.Color('#232E1B'),
    emissiveIntensity: 0.35,
    roughness: 0.28,
    roughnessMap,
    metalness: 0.06,
    clearcoat: 0.65,
    clearcoatRoughness: 0.22,
    reflectivity: 0.75,
    sheen: 0.85,
    sheenColor: new THREE.Color('#DBE4A9'),
    sheenRoughness: 0.35,
    side: THREE.DoubleSide,
  });

  // Inner Dew / Pale Moss Core Accent Material
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#DBE4A9'),
    emissive: new THREE.Color('#475A38'),
    emissiveIntensity: 0.25,
    roughness: 0.2,
    metalness: 0.12,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
  });

  const petalPivots: THREE.Group[] = [];
  const petalMeshes: THREE.Mesh[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [petalBaseMaterial, coreMaterial];

  // SVG coordinate scale: radius ~120.72 px -> normalize to ~2.4 world units
  const worldScale = (options.scale ?? 1) * 0.021;

  RENOVARE_PETAL_PATHS.forEach((petal, idx) => {
    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="${petal.outerPath} ${petal.holePath}"/></svg>`;
    const parsed = loader.parse(svgMarkup);

    const shapes: THREE.Shape[] = [];
    parsed.paths.forEach((p) => {
      const extracted = SVGLoader.createShapes(p);
      shapes.push(...extracted);
    });

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 6.8,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 2.2,
      bevelThickness: 2.6,
      curveSegments: 36,
    };

    const geom = new THREE.ExtrudeGeometry(shapes, extrudeSettings);

    // Transform geometry into petal-local coordinates anchored at the lily center (309.4, 120.72)
    // and apply a subtle radial thickness taper so the flat cap planes remain planar and artifact-free.
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      // Center relative to lily origin; flip Y because SVG Y points downward
      const lx = (v.x - LILY_CENTER.x) * worldScale;
      const ly = -(v.y - LILY_CENTER.y) * worldScale;
      const lz = (v.z - 3.4) * worldScale;

      // Keep ExtrudeGeometry cap faces strictly planar so vertex normals on un-subdivided caps remain 100% uniform
      pos.setXYZ(i, lx, ly, lz);
    }

    geom.computeVertexNormals();
    geometriesToDispose.push(geom);

    // Individual material clone so petals can catch subtle phase highlights
    const mat = petalBaseMaterial.clone();
    materialsToDispose.push(mat);

    const mesh = new THREE.Mesh(geom, mat);
    mesh.name = `${petal.id}-mesh`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const pivot = new THREE.Group();
    pivot.name = `${petal.id}-pivot`;
    pivot.userData.petalIndex = idx;
    pivot.userData.baseAngleRad = THREE.MathUtils.degToRad(petal.angleDeg);
    pivot.add(mesh);

    petalPivots.push(pivot);
    petalMeshes.push(mesh);
    root.add(pivot);
  });

  // Central botanical pistil / luminous seed ring
  const coreGroup = new THREE.Group();
  coreGroup.name = 'lily-core-group';

  const centerSphereGeom = new THREE.SphereGeometry(0.11, 24, 24);
  centerSphereGeom.scale(1, 1, 0.55);
  geometriesToDispose.push(centerSphereGeom);
  const centerSphere = new THREE.Mesh(centerSphereGeom, coreMaterial);
  centerSphere.position.z = 0.05;
  coreGroup.add(centerSphere);

  // 8 subtle dewdrop stamens around the center vortex
  const stamenGeom = new THREE.SphereGeometry(0.032, 12, 12);
  geometriesToDispose.push(stamenGeom);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const dot = new THREE.Mesh(stamenGeom, coreMaterial);
    dot.position.set(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0.06);
    coreGroup.add(dot);
  }

  root.add(coreGroup);

  const bloomProgress = { value: options.reducedMotion ? 1 : 0 };
  const scrollProgress = { value: 0 };
  const pointerTarget = { x: 0, y: 0 };
  const activeHighlightIndex = { value: -1 };

  const applyPetalChoreography = (timeSec: number) => {
    const bloom = THREE.MathUtils.clamp(bloomProgress.value, 0, 1);
    const scroll = THREE.MathUtils.clamp(scrollProgress.value, 0, 1);

    petalPivots.forEach((pivot, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radialDirX = Math.sin(angle);
      const radialDirY = Math.cos(angle);
      // Tangent axis perpendicular to the petal's radial vector for natural outward unfolding
      const tangentX = -radialDirY;
      const tangentY = radialDirX;

      // Stagger each petal slightly along the spiral
      const localBloom = THREE.MathUtils.smoothstep(
        THREE.MathUtils.clamp(bloom * 1.25 - i * 0.03, 0, 1),
        0,
        1
      );

      // Closed bud tilts petals forward (+Z cup); blooming opens them flat and slightly arched
      const closedCupAngle = 0.62;
      const openCupAngle = 0.06 + scroll * 0.14;
      const cupAngle = THREE.MathUtils.lerp(closedCupAngle, openCupAngle, localBloom);

      // Breathing idle wave (disabled when reducedMotion is true)
      const breathe = options.reducedMotion
        ? 0
        : Math.sin(timeSec * 1.45 + i * (Math.PI / 4)) * 0.035 * localBloom;

      const totalTilt = cupAngle + breathe;

      pivot.rotation.set(
        tangentX * totalTilt,
        tangentY * totalTilt,
        (1 - localBloom) * -0.38 + scroll * 0.18
      );

      const scaleVal = THREE.MathUtils.lerp(0.45, 1.0, localBloom);
      pivot.scale.setScalar(scaleVal);

      // Subtle spiral lift in Z so overlapping petals never Z-fight
      const breathZ = options.reducedMotion
        ? 0
        : Math.cos(timeSec * 1.45 + i * 0.78) * 0.018 * localBloom;
      const radialSpread = scroll * 0.09 * localBloom;
      pivot.position.set(
        radialDirX * radialSpread,
        radialDirY * radialSpread,
        i * 0.012 + (1 - localBloom) * 0.18 + breathZ
      );

      // Subtle sheen shift on active or hovered petal
      const mat = petalMeshes[i].material as THREE.MeshPhysicalMaterial;
      const waveGlow = options.reducedMotion
        ? 0.3
        : 0.28 + 0.18 * (0.5 + 0.5 * Math.sin(timeSec * 1.2 + i * 0.8));
      const isHighlighted = activeHighlightIndex.value === i;
      mat.emissiveIntensity = isHighlighted ? 0.65 : waveGlow;
    });

    const coreScale = THREE.MathUtils.lerp(0.2, 1.0, bloom);
    coreGroup.scale.setScalar(coreScale);
    coreGroup.rotation.z = -timeSec * 0.15 - scroll * Math.PI * 0.5;

    // Overall root rotation driven by scroll + gentle pointer parallax
    const baseScrollRotZ = -scroll * Math.PI * 0.65;
    const idleSpin = options.reducedMotion ? 0 : Math.sin(timeSec * 0.35) * 0.05;
    root.rotation.z = baseScrollRotZ + idleSpin;

    const targetRotX = pointerTarget.y * 0.24 - 0.12;
    const targetRotY = pointerTarget.x * 0.28 + 0.14;
    root.rotation.x += (targetRotX - root.rotation.x) * 0.07;
    root.rotation.y += (targetRotY - root.rotation.y) * 0.07;
  };

  // Initialize pose at t=0
  applyPetalChoreography(0);

  const runtime: LilySculptRuntime = {
    petalPivots,
    petalMeshes,
    coreGroup,
    bloomProgress,
    scrollProgress,
    pointerTarget,
    activeHighlightIndex,
    setBloom(progress: number) {
      bloomProgress.value = progress;
      applyPetalChoreography(0);
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      roughnessMap.dispose();
    },
  };

  root.userData.sculptRuntime = runtime;
  root.userData.tick = (timeSec: number) => {
    applyPetalChoreography(timeSec);
  };

  return root;
}
