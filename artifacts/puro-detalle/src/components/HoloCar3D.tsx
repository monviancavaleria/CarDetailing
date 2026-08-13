import React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import type { SizeId } from '../data/services';

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>;
import { SERVICE_PARTS, type PartId } from './HoloCarXray';

/**
 * Escena 3D del cotizador (v3).
 * UN ÚNICO modelo base premium estilo holograma/rayos X para las cuatro
 * tallas: mismo material oscuro semitransparente, mismos contornos y el
 * mismo nivel de detalle interno (motor con cilindros, chasis, suspensión,
 * asientos, salpicadero). Cada talla NO es un coche distinto: es el mismo
 * modelo ajustado geométricamente con proporciones (longitud, altura de
 * techo, caída trasera, capó…) según su categoría real:
 *   S compacto · M sedán · L SUV · XL furgoneta/SUV grande.
 * Interacciones: glow de malla completa por servicio, OrbitControls 360º
 * y transición de cámara al habitáculo en la pestaña INTERIOR.
 */

/* ---------------- Tono único premium ---------------- */

const TONE = {
  body: '#0D2133',
  neon: new THREE.Color('#37B6FF'),
  emissiveBase: new THREE.Color('#123B5C'),
  edge: '#4FA9DE',
  edgeActive: '#8FE3FF',
};

/* ---------------- Proporciones por talla (mismo modelo base) ---------------- */

type CarSpec = {
  length: number; // metros
  width: number;
  height: number;
  wheelR: number;
  frontAxle: number; // x normalizado 0(morro)–1(trasera)
  rearAxle: number;
  // Parámetros de proporción del ÚNICO perfil base:
  noseH: number; //   altura del morro (0–1 de height)
  hoodEndX: number; //   dónde termina el capó
  hoodH: number; //   altura del capó
  windshieldTopX: number; //   base superior del parabrisas
  roofH: number; //   altura del techo (0–1)
  roofEndX: number; //   dónde empieza a caer el techo
  rearDeckX: number; //   fin de la caída (luneta)
  rearDeckH: number; //   altura del maletero/portón
  tailH: number; //   altura del corte trasero
  seatRows: number[]; // x normalizado de cada fila
  dashX: number;
  trunkX: number;
  cabinEyeX: number; // cámara interior (x normalizado)
};

const SPECS: Record<SizeId, CarSpec> = {
  // S · compacto <4,20 m: capó corto, techo que cae pronto, portón casi vertical
  S: {
    length: 4.0, width: 1.74, height: 1.48, wheelR: 0.3, frontAxle: 0.17, rearAxle: 0.83,
    noseH: 0.44, hoodEndX: 0.32, hoodH: 0.52, windshieldTopX: 0.5, roofH: 1.0,
    roofEndX: 0.72, rearDeckX: 0.93, rearDeckH: 0.58, tailH: 0.5,
    seatRows: [0.5, 0.72], dashX: 0.4, trunkX: 0.88, cabinEyeX: 0.62,
  },
  // M · sedán 4,20–4,60 m: capó largo, techo bajo, maletero escalonado
  M: {
    length: 4.5, width: 1.84, height: 1.44, wheelR: 0.32, frontAxle: 0.16, rearAxle: 0.8,
    noseH: 0.42, hoodEndX: 0.34, hoodH: 0.5, windshieldTopX: 0.5, roofH: 0.98,
    roofEndX: 0.66, rearDeckX: 0.84, rearDeckH: 0.52, tailH: 0.46,
    seatRows: [0.46, 0.66], dashX: 0.37, trunkX: 0.9, cabinEyeX: 0.58,
  },
  // L · SUV 4,60–4,90 m: capó alto, techo largo, portón vertical
  L: {
    length: 4.75, width: 1.93, height: 1.72, wheelR: 0.37, frontAxle: 0.17, rearAxle: 0.8,
    noseH: 0.5, hoodEndX: 0.3, hoodH: 0.58, windshieldTopX: 0.46, roofH: 1.0,
    roofEndX: 0.86, rearDeckX: 0.97, rearDeckH: 0.6, tailH: 0.54,
    seatRows: [0.44, 0.63, 0.79], dashX: 0.35, trunkX: 0.89, cabinEyeX: 0.56,
  },
  // XL · furgoneta/SUV grande >4,90 m: morro corto, caja alta y larga
  XL: {
    length: 5.1, width: 1.97, height: 1.92, wheelR: 0.36, frontAxle: 0.15, rearAxle: 0.82,
    noseH: 0.54, hoodEndX: 0.18, hoodH: 0.62, windshieldTopX: 0.3, roofH: 1.0,
    roofEndX: 0.92, rearDeckX: 0.99, rearDeckH: 0.62, tailH: 0.55,
    seatRows: [0.34, 0.54, 0.74], dashX: 0.26, trunkX: 0.9, cabinEyeX: 0.5,
  },
};

/* ---------------- Material holográfico compartido ---------------- */

function useHoloMaterial(active: boolean, baseOpacity: number, dimmed: boolean) {
  const mat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: TONE.body,
        transparent: true,
        opacity: baseOpacity,
        roughness: 0.3,
        metalness: 0.3,
        emissive: TONE.emissiveBase.clone(),
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, dt) => {
    const k = Math.min(dt * 5, 1);
    const tI = active ? 1.8 : 0.3;
    const tO = active ? Math.min(baseOpacity + 0.3, 0.85) : dimmed ? baseOpacity * 0.4 : baseOpacity;
    mat.emissiveIntensity += (tI - mat.emissiveIntensity) * k;
    mat.opacity += (tO - mat.opacity) * k;
    mat.emissive.lerp(active ? TONE.neon : TONE.emissiveBase, k);
  });

  React.useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

function HoloMesh({
  geometry,
  active,
  baseOpacity = 0.2,
  dimmed = false,
  showEdges = true,
  ...props
}: {
  geometry: THREE.BufferGeometry;
  active: boolean;
  baseOpacity?: number;
  dimmed?: boolean;
  showEdges?: boolean;
} & ThreeElements['mesh']) {
  const mat = useHoloMaterial(active, baseOpacity, dimmed);
  return (
    <mesh geometry={geometry} material={mat} {...props}>
      {showEdges && (
        <Edges
          geometry={geometry}
          threshold={20}
          color={active ? TONE.edgeActive : TONE.edge}
          transparent
          opacity={active ? 0.95 : dimmed ? 0.25 : 0.6}
        />
      )}
    </mesh>
  );
}

/* ---------------- Perfil ÚNICO parametrizado (mismo modelo base) ---------------- */

function buildBodyShape(spec: CarSpec): THREE.Shape {
  const { length: L, height: H, wheelR, frontAxle, rearAxle } = spec;
  const X = (n: number) => n * L - L / 2;
  const Y = (n: number) => n * H;
  const s = new THREE.Shape();
  const y0 = Y(0.12); // bajos
  const archR = wheelR * 1.18;

  // Una única silueta premium: morro → capó → parabrisas → techo → luneta → cola.
  // Las tallas solo mueven estos puntos de control.
  s.moveTo(X(0), y0 + 0.06);
  s.quadraticCurveTo(X(0), Y(spec.noseH * 0.9), X(0.045), Y(spec.noseH)); // morro redondeado
  s.quadraticCurveTo(X(spec.hoodEndX * 0.55), Y(spec.hoodH + 0.02), X(spec.hoodEndX), Y(spec.hoodH)); // capó
  s.quadraticCurveTo(
    X(spec.hoodEndX + (spec.windshieldTopX - spec.hoodEndX) * 0.35),
    Y(spec.hoodH + 0.04),
    X(spec.windshieldTopX),
    Y(spec.roofH * 0.93)
  ); // parabrisas inclinado
  s.quadraticCurveTo(X(spec.windshieldTopX + 0.06), Y(spec.roofH), X(spec.windshieldTopX + 0.14), Y(spec.roofH)); // unión techo
  s.lineTo(X(spec.roofEndX), Y(spec.roofH * 0.985)); // techo
  s.quadraticCurveTo(
    X(spec.roofEndX + (spec.rearDeckX - spec.roofEndX) * 0.6),
    Y(spec.roofH * 0.9),
    X(spec.rearDeckX),
    Y(spec.rearDeckH)
  ); // luneta / portón
  s.quadraticCurveTo(X(1), Y(spec.tailH), X(1), y0 + 0.06); // cola

  // Bajos con pasos de rueda
  const rearX = X(rearAxle);
  const frontX = X(frontAxle);
  s.lineTo(rearX + archR, y0);
  s.absarc(rearX, y0, archR, 0, Math.PI, false);
  s.lineTo(frontX + archR, y0);
  s.absarc(frontX, y0, archR, 0, Math.PI, false);
  s.lineTo(X(0), y0);
  s.closePath();
  return s;
}

function buildGlassShape(spec: CarSpec): THREE.Shape {
  const { length: L, height: H } = spec;
  const X = (n: number) => n * L - L / 2;
  const Y = (n: number) => n * H;
  const s = new THREE.Shape();
  const pts: [number, number][] = [
    [spec.hoodEndX + 0.04, spec.hoodH + 0.04],
    [spec.windshieldTopX + 0.02, spec.roofH * 0.9],
    [spec.windshieldTopX + 0.15, spec.roofH * 0.94],
    [spec.roofEndX - 0.02, spec.roofH * 0.92],
    [Math.min(spec.rearDeckX - 0.02, 0.97), spec.rearDeckH + 0.06],
  ];
  pts.forEach(([px, py], i) => (i === 0 ? s.moveTo(X(px), Y(py)) : s.lineTo(X(px), Y(py))));
  s.closePath();
  return s;
}

function extrude(shape: THREE.Shape, width: number, steps = 1) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    steps,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 24,
  });
  geo.translate(0, 0, -width / 2);
  return geo;
}

/**
 * Esculpe la extrusión plana para dar volumen real de coche:
 * - "tumblehome": la cabina se estrecha hacia el techo (sección redondeada)
 * - hombros redondeados bajo la línea de cintura
 * - morro y cola más estrechos en planta (el coche no es un ladrillo)
 */
/** Factor de estrechamiento lateral (0–1) en un punto (nx 0–1, y en metros). */
function taperFactor(spec: CarSpec, nx: number, y: number) {
  const H = spec.height;
  const yBelt = spec.hoodH * H;
  const yTop = spec.roofH * H;
  const dNose = Math.pow(Math.max(0, 1 - nx / 0.16), 2);
  const dTail = Math.pow(Math.max(0, (nx - 0.86) / 0.14), 2);
  let f = 1 - 0.16 * dNose - 0.12 * dTail;
  if (y > yBelt) {
    const k = Math.min((y - yBelt) / Math.max(yTop - yBelt, 0.001), 1);
    f *= 1 - 0.26 * Math.pow(k, 1.35);
  } else {
    const k = 1 - y / Math.max(yBelt, 0.001);
    f *= 1 - 0.05 * k * k;
  }
  return f;
}

function sculptBody(geo: THREE.BufferGeometry, spec: CarSpec) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const L = spec.length;
  const halfW = spec.width / 2 + 0.05; // incluye bisel
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = Math.min(Math.max((x + L / 2) / L, 0), 1); // 0 morro – 1 cola
    const f = taperFactor(spec, nx, y);
    pos.setZ(i, THREE.MathUtils.clamp(z * f, -halfW, halfW));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/* ---------------- Rueda completa (neumático + llanta de 5 radios + freno) ---------------- */

function Wheel({ spec, x, side, active }: { spec: CarSpec; x: number; side: 1 | -1; active: boolean }) {
  const geos = React.useMemo(() => {
    const r = spec.wheelR;
    return {
      tire: new THREE.TorusGeometry(r * 0.82, r * 0.26, 16, 48),
      rimRing: new THREE.TorusGeometry(r * 0.56, r * 0.045, 10, 36),
      hub: new THREE.CylinderGeometry(r * 0.12, r * 0.12, r * 0.4, 12),
      spoke: new THREE.BoxGeometry(r * 0.11, r * 1.06, r * 0.08),
      disc: new THREE.CylinderGeometry(r * 0.4, r * 0.4, r * 0.05, 24),
      spring: new THREE.TorusGeometry(r * 0.22, r * 0.05, 8, 20),
    };
  }, [spec]);
  React.useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  const z = (spec.width / 2) * 0.86 * side;
  return (
    <group position={[x, spec.wheelR, z]}>
      <HoloMesh geometry={geos.tire} active={active} baseOpacity={0.25} />
      <HoloMesh geometry={geos.rimRing} active={active} baseOpacity={0.35} showEdges={false} />
      <HoloMesh geometry={geos.hub} active={active} baseOpacity={0.4} rotation={[Math.PI / 2, 0, 0]} showEdges={false} />
      <HoloMesh geometry={geos.disc} active={active} baseOpacity={0.2} rotation={[Math.PI / 2, 0, 0]} showEdges={false} />
      {[0, 1, 2, 3, 4].map((i) => (
        <HoloMesh
          key={i}
          geometry={geos.spoke}
          active={active}
          baseOpacity={0.32}
          showEdges={false}
          rotation={[0, 0, (i * Math.PI * 2) / 5]}
        />
      ))}
      {/* Muelle de suspensión sobre la rueda */}
      {[0, 1, 2].map((i) => (
        <HoloMesh
          key={`sp${i}`}
          geometry={geos.spring}
          active={active}
          baseOpacity={0.24}
          showEdges={false}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, spec.wheelR * (0.9 + i * 0.28), -side * spec.wheelR * 0.35]}
        />
      ))}
    </group>
  );
}

/* ---------------- Motor detallado (bloque + cilindros + admisión) ---------------- */

function Engine({ spec, active }: { spec: CarSpec; active: boolean }) {
  const L = spec.length;
  const geos = React.useMemo(
    () => ({
      block: new THREE.BoxGeometry(L * 0.15, spec.height * 0.2, spec.width * 0.46),
      cyl: new THREE.CylinderGeometry(0.05, 0.05, spec.height * 0.14, 10),
      intake: new THREE.CylinderGeometry(0.045, 0.045, spec.width * 0.4, 10),
      battery: new THREE.BoxGeometry(L * 0.05, spec.height * 0.08, spec.width * 0.14),
    }),
    [spec, L]
  );
  React.useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  const X = (n: number) => n * L - L / 2;
  const cx = X(spec.frontAxle + 0.02);
  const cy = spec.height * 0.32;
  return (
    <group>
      <HoloMesh geometry={geos.block} active={active} baseOpacity={0.26} position={[cx, cy, 0]} />
      {[-1.5, -0.5, 0.5, 1.5].map((i) => (
        <HoloMesh
          key={i}
          geometry={geos.cyl}
          active={active}
          baseOpacity={0.34}
          showEdges={false}
          position={[cx + i * L * 0.032, cy + spec.height * 0.15, 0]}
        />
      ))}
      <HoloMesh
        geometry={geos.intake}
        active={active}
        baseOpacity={0.3}
        showEdges={false}
        rotation={[Math.PI / 2, 0, 0]}
        position={[cx - L * 0.06, cy + spec.height * 0.1, 0]}
      />
      <HoloMesh geometry={geos.battery} active={active} baseOpacity={0.3} position={[cx + L * 0.09, cy + spec.height * 0.06, spec.width * 0.28]} />
    </group>
  );
}

/* ---------------- Modelo completo (base única para todas las tallas) ---------------- */

function CarModel({ size, activeParts, xray }: { size: SizeId; activeParts: Set<PartId>; xray: boolean }) {
  const spec = SPECS[size];
  const L = spec.length;
  const X = (n: number) => n * L - L / 2;

  const geos = React.useMemo(() => {
    const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
    return {
      body: sculptBody(extrude(buildBodyShape(spec), spec.width), spec),
      glass: sculptBody(extrude(buildGlassShape(spec), spec.width * 0.9), spec),
      mirror: box(L * 0.025, spec.height * 0.045, 0.09),
      mirrorArm: box(L * 0.012, 0.02, 0.07),
      grilleBar: box(0.03, 0.02, spec.width * 0.4),
      taillight: box(0.05, spec.height * 0.05, spec.width * 0.16),
      handle: box(L * 0.035, 0.02, 0.015),
      door: box(L * 0.3, spec.height * 0.32, 0.02),
      bumperF: box(0.16, spec.height * 0.18, spec.width * 0.94),
      bumperR: box(0.16, spec.height * 0.18, spec.width * 0.94),
      headlight: box(0.06, spec.height * 0.07, spec.width * 0.2),
      seatBase: box(L * 0.1, 0.12, spec.width * 0.3),
      seatBack: box(L * 0.04, spec.height * 0.26, spec.width * 0.3),
      bench: box(L * 0.1, 0.12, spec.width * 0.68),
      benchBack: box(L * 0.04, spec.height * 0.24, spec.width * 0.68),
      dash: box(L * 0.05, spec.height * 0.16, spec.width * 0.76),
      wheelSteer: new THREE.TorusGeometry(0.17, 0.025, 8, 20),
      floor: box(L * 0.5, 0.04, spec.width * 0.78),
      rail: box(L * 0.82, 0.05, 0.06),
      crossmember: box(0.06, 0.05, spec.width * 0.66),
      exhaust: new THREE.CylinderGeometry(0.035, 0.035, L * 0.45, 8),
      trunk: box(L * 0.14, spec.height * 0.22, spec.width * 0.66),
    };
  }, [spec, L]);

  React.useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);

  const on = (p: PartId) => activeParts.has(p);
  const bodyOpacity = xray ? 0.07 : 0.16;

  return (
    <group>
      <HoloMesh geometry={geos.body} active={on('body')} baseOpacity={bodyOpacity} dimmed={xray} />
      <HoloMesh geometry={geos.glass} active={on('glass')} baseOpacity={xray ? 0.05 : 0.1} dimmed={xray} />
      {([1, -1] as const).map((side) => (
        <HoloMesh
          key={side}
          geometry={geos.door}
          active={on('doors')}
          baseOpacity={0.14}
          position={[X(0.55), spec.height * 0.34, (spec.width / 2 + 0.04) * side]}
        />
      ))}
      <HoloMesh geometry={geos.bumperF} active={on('trim')} baseOpacity={0.22} position={[X(0.01), spec.height * 0.2, 0]} />
      <HoloMesh geometry={geos.bumperR} active={on('trim')} baseOpacity={0.22} position={[X(0.99), spec.height * 0.2, 0]} />
      {([1, -1] as const).map((side) => (
        <HoloMesh
          key={`hl${side}`}
          geometry={geos.headlight}
          active={on('trim')}
          baseOpacity={0.34}
          showEdges={false}
          position={[X(0.015), spec.height * spec.noseH * 0.82, spec.width * 0.3 * side]}
        />
      ))}
      {/* Detalles exteriores: retrovisores, parrilla, pilotos y tiradores */}
      {([1, -1] as const).map((side) => {
        // Semianchura real de la carrocería esculpida en el punto de anclaje
        const mirY = spec.height * (spec.hoodH + 0.08);
        const halfW = (spec.width / 2) * taperFactor(spec, spec.hoodEndX + 0.045, mirY);
        return (
          <group key={`mir${side}`}>
            <HoloMesh
              geometry={geos.mirror}
              active={on('trim')}
              baseOpacity={0.3}
              position={[X(spec.hoodEndX + 0.045), mirY + spec.height * 0.02, (halfW + 0.09) * side]}
            />
            <HoloMesh
              geometry={geos.mirrorArm}
              active={on('trim')}
              baseOpacity={0.26}
              showEdges={false}
              position={[X(spec.hoodEndX + 0.045), mirY, (halfW + 0.03) * side]}
            />
          </group>
        );
      })}
      {[0, 1, 2].map((i) => (
        <HoloMesh
          key={`gr${i}`}
          geometry={geos.grilleBar}
          active={on('trim')}
          baseOpacity={0.3}
          showEdges={false}
          position={[X(0.005), spec.height * (spec.noseH * 0.55 + i * 0.05), 0]}
        />
      ))}
      {([1, -1] as const).map((side) => (
        <HoloMesh
          key={`tl${side}`}
          geometry={geos.taillight}
          active={on('trim')}
          baseOpacity={0.32}
          showEdges={false}
          position={[X(0.99), spec.height * spec.tailH * 0.9, spec.width * 0.32 * side]}
        />
      ))}
      {([1, -1] as const).map((side) =>
        [0.44, 0.66].map((n) => {
          const hy = spec.height * (spec.hoodH + 0.02);
          const halfW = (spec.width / 2) * taperFactor(spec, n, hy);
          return (
            <HoloMesh
              key={`hd${side}${n}`}
              geometry={geos.handle}
              active={on('doors')}
              baseOpacity={0.32}
              showEdges={false}
              position={[X(n), hy, (halfW + 0.055) * side]}
            />
          );
        })
      )}
      <Engine spec={spec} active={on('engine')} />
      {/* Chasis: largueros + travesaños + escape */}
      {([1, -1] as const).map((side) => (
        <HoloMesh
          key={`rail${side}`}
          geometry={geos.rail}
          active={on('floor')}
          baseOpacity={0.22}
          showEdges={false}
          position={[X(0.5), spec.height * 0.1, spec.width * 0.3 * side]}
        />
      ))}
      {[0.3, 0.5, 0.7].map((n) => (
        <HoloMesh
          key={`cross${n}`}
          geometry={geos.crossmember}
          active={on('floor')}
          baseOpacity={0.22}
          showEdges={false}
          position={[X(n), spec.height * 0.1, 0]}
        />
      ))}
      <HoloMesh
        geometry={geos.exhaust}
        active={on('floor')}
        baseOpacity={0.24}
        showEdges={false}
        rotation={[0, 0, Math.PI / 2]}
        position={[X(0.72), spec.height * 0.08, -spec.width * 0.18]}
      />
      <HoloMesh geometry={geos.floor} active={on('floor')} baseOpacity={0.24} position={[X(0.6), spec.height * 0.16, 0]} />
      <HoloMesh geometry={geos.dash} active={on('dashboard')} baseOpacity={0.26} position={[X(spec.dashX), spec.height * 0.44, 0]} />
      <HoloMesh
        geometry={geos.wheelSteer}
        active={on('dashboard')}
        baseOpacity={0.32}
        position={[X(spec.dashX + 0.05), spec.height * 0.48, spec.width * 0.22]}
        rotation={[0.4, Math.PI / 2, 0]}
        showEdges={false}
      />
      {spec.seatRows.map((row, i) =>
        i < spec.seatRows.length - 1 ? (
          <group key={row}>
            {([1, -1] as const).map((side) => (
              <group key={side} position={[X(row), spec.height * 0.26, spec.width * 0.21 * side]}>
                <HoloMesh geometry={geos.seatBase} active={on('seats')} baseOpacity={0.26} />
                <HoloMesh geometry={geos.seatBack} active={on('seats')} baseOpacity={0.26} position={[L * 0.05, spec.height * 0.13, 0]} />
              </group>
            ))}
          </group>
        ) : (
          <group key={row} position={[X(row), spec.height * 0.26, 0]}>
            <HoloMesh geometry={geos.bench} active={on('seats')} baseOpacity={0.26} />
            <HoloMesh geometry={geos.benchBack} active={on('seats')} baseOpacity={0.26} position={[L * 0.05, spec.height * 0.12, 0]} />
          </group>
        )
      )}
      <HoloMesh geometry={geos.trunk} active={on('trunk')} baseOpacity={0.22} position={[X(spec.trunkX), spec.height * 0.32, 0]} />
      <Wheel spec={spec} x={X(spec.frontAxle)} side={1} active={on('wheels')} />
      <Wheel spec={spec} x={X(spec.frontAxle)} side={-1} active={on('wheels')} />
      <Wheel spec={spec} x={X(spec.rearAxle)} side={1} active={on('wheels')} />
      <Wheel spec={spec} x={X(spec.rearAxle)} side={-1} active={on('wheels')} />
      <gridHelper args={[16, 24, '#123B5C', '#0C2438']} position={[0, -0.01, 0]} />
    </group>
  );
}

/* ---------------- Cámara: exterior orbital / interior dentro del habitáculo ---------------- */

function CameraRig({ zone, size }: { zone: 'exterior' | 'interior'; size: SizeId }) {
  const { camera } = useThree();
  const controls = React.useRef<OrbitControlsImpl>(null);
  const spec = SPECS[size];
  const X = (n: number) => n * spec.length - spec.length / 2;

  const targets = React.useMemo(() => {
    return zone === 'interior'
      ? {
          pos: new THREE.Vector3(X(spec.cabinEyeX), spec.height * 0.62, 0),
          look: new THREE.Vector3(X(spec.dashX - 0.05), spec.height * 0.45, 0),
        }
      : {
          pos: new THREE.Vector3(spec.length * 1.05, spec.height * 1.5, spec.length * 1.05),
          look: new THREE.Vector3(0, spec.height * 0.45, 0),
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, size]);

  // Mientras el usuario no arrastra, la cámara se acerca suavemente a su destino
  const dragging = React.useRef(false);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    if (!dragging.current) {
      const k = Math.min(dt * 2.5, 1);
      camera.position.lerp(targets.pos, k);
      c.target.lerp(targets.look, k);
      c.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableZoom={false}
      enablePan={false}
      autoRotate={zone === 'exterior'}
      autoRotateSpeed={0.8}
      rotateSpeed={0.9}
      minPolarAngle={zone === 'interior' ? Math.PI / 3 : Math.PI / 5}
      maxPolarAngle={Math.PI / 2.02}
      onStart={() => (dragging.current = true)}
      onEnd={() => {
        // tras soltar, en interior volvemos al punto de vista del habitáculo
        window.setTimeout(() => (dragging.current = false), zone === 'interior' ? 1800 : 4000);
      }}
    />
  );
}

/* ---------------- Componente público ---------------- */

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function HoloCar3D({
  size,
  selectedServices,
  zone,
}: {
  size: SizeId;
  selectedServices: Set<string>;
  zone: 'exterior' | 'interior';
}) {
  const activeParts = React.useMemo(() => {
    const parts = new Set<PartId>();
    selectedServices.forEach((id) => SERVICE_PARTS[id]?.forEach((p) => parts.add(p)));
    return parts;
  }, [selectedServices]);

  return (
    <div className="w-full h-[280px] sm:h-[340px] lg:h-[380px] cursor-grab active:cursor-grabbing" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [5.2, 2.6, 5.2], fov: 34, near: 0.05, far: 60 }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={0.9} color="#BFE7FF" />
        <pointLight position={[-5, 2, -4]} intensity={0.5} color="#37B6FF" />
        <CarModel size={size} activeParts={activeParts} xray={zone === 'interior'} />
        <CameraRig zone={zone} size={size} />
      </Canvas>
    </div>
  );
}
