import React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import type { SizeId } from '../data/services';

/**
 * Coche 3D estilo "holograma técnico" para el cotizador.
 * - Geometría 100% procedural (sin modelos externos): carrocería por
 *   perfil lateral extruido, distinta según tamaño S/M/L/XL.
 * - Materiales oscuros semitransparentes (rayos X) con aristas cian.
 * - Las piezas se iluminan (emisivo azul neón) según los servicios
 *   seleccionados; la transición es suave (lerp en cada frame).
 */

export type PartId =
  | 'body'
  | 'glass'
  | 'wheels'
  | 'trim'
  | 'engine'
  | 'seats'
  | 'dashboard'
  | 'floor'
  | 'trunk'
  | 'doors';

/** Qué piezas del coche ilumina cada servicio del cotizador. */
export const SERVICE_PARTS: Record<string, PartId[]> = {
  'lavado-mano': ['body'],
  llantas: ['wheels'],
  cristales: ['glass'],
  'sellado-sio2': ['body'],
  'sellador-neumaticos': ['wheels'],
  'plasticos-ext': ['trim'],
  'motor-basico': ['engine'],
  'motor-vapor': ['engine'],
  aspirado: ['floor'],
  maletero: ['trunk'],
  puertas: ['doors'],
  'plasticos-int': ['dashboard'],
  vapor: ['floor', 'seats', 'dashboard'],
  'asientos-tela': ['seats'],
  'asientos-cuero': ['seats'],
};

const NEON = new THREE.Color('#37B6FF');
const BASE_EMISSIVE = new THREE.Color('#0B2E4A');

type CarSpec = {
  length: number;
  width: number;
  height: number;
  wheelR: number;
  /** Perfil lateral de la carrocería, coordenadas normalizadas [x, y]. */
  profile: [number, number][];
  /** Perfil del acristalamiento. */
  glass: [number, number][];
  frontAxle: number; // x normalizado
  rearAxle: number;
  seatRows: number[];
};

const SPECS: Record<SizeId, CarSpec> = {
  S: {
    length: 3.9,
    width: 1.72,
    height: 1.5,
    wheelR: 0.32,
    profile: [
      [0, 0.14], [0, 0.42], [0.09, 0.47], [0.34, 0.52], [0.47, 0.95],
      [0.8, 1.0], [0.93, 0.52], [1, 0.46], [1, 0.14], [0.88, 0.08], [0.12, 0.08],
    ],
    glass: [ [0.37, 0.54], [0.485, 0.93], [0.79, 0.97], [0.9, 0.54] ],
    frontAxle: 0.19, rearAxle: 0.82,
    seatRows: [0.52, 0.74],
  },
  M: {
    length: 4.6,
    width: 1.82,
    height: 1.44,
    wheelR: 0.33,
    profile: [
      [0, 0.15], [0, 0.42], [0.08, 0.46], [0.33, 0.5], [0.45, 0.93],
      [0.68, 0.97], [0.84, 0.55], [0.98, 0.5], [1, 0.44], [1, 0.15], [0.9, 0.08], [0.1, 0.08],
    ],
    glass: [ [0.36, 0.52], [0.465, 0.91], [0.67, 0.94], [0.81, 0.52] ],
    frontAxle: 0.17, rearAxle: 0.8,
    seatRows: [0.48, 0.68],
  },
  L: {
    length: 4.75,
    width: 1.92,
    height: 1.75,
    wheelR: 0.38,
    profile: [
      [0, 0.16], [0, 0.5], [0.07, 0.55], [0.3, 0.58], [0.42, 0.97],
      [0.88, 1.0], [0.96, 0.58], [1, 0.52], [1, 0.16], [0.9, 0.09], [0.1, 0.09],
    ],
    glass: [ [0.33, 0.6], [0.44, 0.95], [0.86, 0.97], [0.94, 0.6] ],
    frontAxle: 0.18, rearAxle: 0.81,
    seatRows: [0.46, 0.66, 0.82],
  },
  XL: {
    length: 5.05,
    width: 1.98,
    height: 1.95,
    wheelR: 0.38,
    profile: [
      [0, 0.15], [0, 0.5], [0.06, 0.56], [0.16, 0.62], [0.26, 0.98],
      [0.95, 1.0], [1, 0.6], [1, 0.15], [0.92, 0.09], [0.08, 0.09],
    ],
    glass: [ [0.19, 0.64], [0.28, 0.95], [0.93, 0.96], [0.96, 0.64] ],
    frontAxle: 0.17, rearAxle: 0.83,
    seatRows: [0.4, 0.6, 0.8],
  },
};

/* ------------------------------------------------------------------ */
/* Material holográfico con brillo animado                             */
/* ------------------------------------------------------------------ */

function useHoloMaterial(active: boolean, baseOpacity: number) {
  const mat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0B1B2C',
        transparent: true,
        opacity: baseOpacity,
        roughness: 0.25,
        metalness: 0.35,
        emissive: BASE_EMISSIVE.clone(),
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    // el material se crea una vez; opacidad base se ajusta en el frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, dt) => {
    const k = Math.min(dt * 5, 1);
    const targetIntensity = active ? 1.6 : 0.25;
    const targetOpacity = active ? Math.min(baseOpacity + 0.25, 0.85) : baseOpacity;
    mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * k;
    mat.opacity += (targetOpacity - mat.opacity) * k;
    mat.emissive.lerp(active ? NEON : BASE_EMISSIVE, k);
  });

  React.useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

function HoloMesh({
  geometry,
  active,
  baseOpacity = 0.16,
  edgeOpacity = 0.55,
  ...props
}: {
  geometry: THREE.BufferGeometry;
  active: boolean;
  baseOpacity?: number;
  edgeOpacity?: number;
} & ThreeElements['mesh']) {
  const mat = useHoloMaterial(active, baseOpacity);
  return (
    <mesh geometry={geometry} material={mat} {...props}>
      <Edges
        geometry={geometry}
        threshold={18}
        color={active ? '#7FDBFF' : '#2E6E9E'}
        transparent
        opacity={active ? 0.95 : edgeOpacity}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Geometrías procedurales                                             */
/* ------------------------------------------------------------------ */

function extrudeProfile(points: [number, number][], spec: CarSpec, widthScale = 1) {
  const { length, height, width } = spec;
  const shape = new THREE.Shape();
  points.forEach(([px, py], i) => {
    const x = px * length - length / 2;
    const y = py * height;
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  });
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width * widthScale,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  geo.translate(0, 0, (-width * widthScale) / 2);
  return geo;
}

function Wheel({ spec, x, side, active }: { spec: CarSpec; x: number; side: 1 | -1; active: boolean }) {
  const tire = React.useMemo(
    () => new THREE.TorusGeometry(spec.wheelR, spec.wheelR * 0.32, 12, 28),
    [spec]
  );
  const rim = React.useMemo(
    () => new THREE.CylinderGeometry(spec.wheelR * 0.62, spec.wheelR * 0.62, spec.wheelR * 0.42, 14),
    [spec]
  );
  React.useEffect(() => () => { tire.dispose(); rim.dispose(); }, [tire, rim]);
  const z = (spec.width / 2) * 0.92 * side;
  return (
    <group position={[x, spec.wheelR, z]}>
      <HoloMesh geometry={tire} active={active} baseOpacity={0.2} />
      <HoloMesh geometry={rim} active={active} baseOpacity={0.25} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function CarModel({ size, activeParts, xray }: { size: SizeId; activeParts: Set<PartId>; xray: boolean }) {
  const spec = SPECS[size];
  const L = spec.length;

  const geos = React.useMemo(() => {
    const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
    return {
      body: extrudeProfile(spec.profile, spec),
      glass: extrudeProfile(spec.glass, spec, 0.9),
      door: box(L * 0.34, spec.height * 0.34, 0.03),
      bumperF: box(0.14, spec.height * 0.2, spec.width * 0.92),
      bumperR: box(0.14, spec.height * 0.2, spec.width * 0.92),
      engine: box(L * 0.2, spec.height * 0.26, spec.width * 0.55),
      seatBase: box(L * 0.11, 0.1, spec.width * 0.32),
      seatBack: box(L * 0.035, spec.height * 0.28, spec.width * 0.32),
      bench: box(L * 0.11, 0.1, spec.width * 0.72),
      benchBack: box(L * 0.035, spec.height * 0.26, spec.width * 0.72),
      dash: box(L * 0.06, spec.height * 0.18, spec.width * 0.78),
      floor: box(L * 0.52, 0.04, spec.width * 0.8),
      trunk: box(L * 0.16, spec.height * 0.24, spec.width * 0.7),
    };
  }, [spec, L]);

  React.useEffect(
    () => () => Object.values(geos).forEach((g) => g.dispose()),
    [geos]
  );

  const nx = (p: number) => p * L - L / 2; // normalizado → mundo
  const groundY = spec.wheelR * 0.9;
  const on = (p: PartId) => activeParts.has(p);
  const bodyOpacity = xray ? 0.08 : 0.16;

  return (
    <group position={[0, -spec.height / 2 - groundY / 2, 0]}>
      {/* Carrocería + cristales */}
      <group position={[0, groundY, 0]}>
        <HoloMesh geometry={geos.body} active={on('body')} baseOpacity={bodyOpacity} />
        <HoloMesh geometry={geos.glass} active={on('glass')} baseOpacity={xray ? 0.06 : 0.12} />
        {/* Puertas (paneles laterales) */}
        {([1, -1] as const).map((side) => (
          <HoloMesh
            key={side}
            geometry={geos.door}
            active={on('doors')}
            baseOpacity={0.12}
            position={[nx(0.52), spec.height * 0.32, (spec.width / 2 + 0.03) * side]}
          />
        ))}
        {/* Paragolpes / plásticos exteriores */}
        <HoloMesh geometry={geos.bumperF} active={on('trim')} baseOpacity={0.2} position={[nx(0.015), spec.height * 0.22, 0]} />
        <HoloMesh geometry={geos.bumperR} active={on('trim')} baseOpacity={0.2} position={[nx(0.985), spec.height * 0.22, 0]} />
        {/* Motor */}
        <HoloMesh geometry={geos.engine} active={on('engine')} baseOpacity={0.24} position={[nx(0.16), spec.height * 0.3, 0]} />
        {/* Habitáculo */}
        <HoloMesh geometry={geos.floor} active={on('floor')} baseOpacity={0.22} position={[nx(0.62), spec.height * 0.14, 0]} />
        <HoloMesh geometry={geos.dash} active={on('dashboard')} baseOpacity={0.22} position={[nx(0.38), spec.height * 0.42, 0]} />
        {spec.seatRows.map((row, i) =>
          i < spec.seatRows.length - 1 ? (
            <group key={row}>
              {([1, -1] as const).map((side) => (
                <group key={side} position={[nx(row), spec.height * 0.24, spec.width * 0.2 * side]}>
                  <HoloMesh geometry={geos.seatBase} active={on('seats')} baseOpacity={0.24} />
                  <HoloMesh geometry={geos.seatBack} active={on('seats')} baseOpacity={0.24} position={[L * 0.045, spec.height * 0.13, 0]} />
                </group>
              ))}
            </group>
          ) : (
            <group key={row} position={[nx(row), spec.height * 0.24, 0]}>
              <HoloMesh geometry={geos.bench} active={on('seats')} baseOpacity={0.24} />
              <HoloMesh geometry={geos.benchBack} active={on('seats')} baseOpacity={0.24} position={[L * 0.045, spec.height * 0.12, 0]} />
            </group>
          )
        )}
        {/* Maletero */}
        <HoloMesh geometry={geos.trunk} active={on('trunk')} baseOpacity={0.2} position={[nx(0.9), spec.height * 0.3, 0]} />
      </group>
      {/* Ruedas */}
      <Wheel spec={spec} x={nx(spec.frontAxle)} side={1} active={on('wheels')} />
      <Wheel spec={spec} x={nx(spec.frontAxle)} side={-1} active={on('wheels')} />
      <Wheel spec={spec} x={nx(spec.rearAxle)} side={1} active={on('wheels')} />
      <Wheel spec={spec} x={nx(spec.rearAxle)} side={-1} active={on('wheels')} />
      {/* Suelo holográfico */}
      <gridHelper
        args={[14, 22, '#123B5C', '#0D2A44']}
        position={[0, -0.01, 0]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Si el navegador no soporta WebGL, mostramos un aviso discreto en vez de romper la página. */
class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-sm font-sans text-[#5F7A93] text-center px-6">
        Tu navegador no puede mostrar la vista 3D del vehículo.
        <br />
        Puedes seguir seleccionando servicios con normalidad.
      </p>
    </div>
  );
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
  const [supported] = React.useState(webglAvailable);
  const activeParts = React.useMemo(() => {
    const parts = new Set<PartId>();
    selectedServices.forEach((id) => SERVICE_PARTS[id]?.forEach((p) => parts.add(p)));
    return parts;
  }, [selectedServices]);

  if (!supported) {
    return (
      <div className="w-full h-[260px] sm:h-[320px] lg:h-[360px]">
        <Fallback />
      </div>
    );
  }

  return (
    <div className="w-full h-[260px] sm:h-[320px] lg:h-[360px]" aria-hidden>
      <CanvasErrorBoundary fallback={<Fallback />}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [5.4, 2.6, 5.4], fov: 32 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 3]} intensity={0.9} color="#BFE7FF" />
        <pointLight position={[-5, 2, -4]} intensity={0.5} color="#37B6FF" />
        <React.Suspense fallback={null}>
          <CarModel size={size} activeParts={activeParts} xray={zone === 'interior'} />
        </React.Suspense>
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.9}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
