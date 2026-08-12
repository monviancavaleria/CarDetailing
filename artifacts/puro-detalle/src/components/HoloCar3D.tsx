import React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import type { SizeId } from '../data/services';

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>;
import { SERVICE_PARTS, type PartId } from './HoloCarXray';

/**
 * Escena 3D del cotizador (v2).
 * - Material y tono ÚNICOS para los cuatro tamaños (mismo azul neón
 *   semitransparente en S, M, L y XL).
 * - Siluetas fieles por categoría: S compacto <4,20 m · M sedán 4,20–4,60 m
 *   · L SUV 4,60–4,90 m · XL SUV grande/furgoneta >4,90 m, con pasos de
 *   rueda, perfiles curvos y proporciones reales.
 * - Al seleccionar un servicio se ilumina LA MALLA COMPLETA de la pieza
 *   (las cuatro ruedas enteras, el bloque motor, los asientos…), no un
 *   punto de luz.
 * - OrbitControls: clic + arrastrar para girar 360°.
 * - Pestaña INTERIOR: la cámara entra suavemente al habitáculo.
 */

/* ---------------- Tono único (tomado del modelo L) ---------------- */

const TONE = {
  body: '#0D2133',
  neon: new THREE.Color('#37B6FF'),
  emissiveBase: new THREE.Color('#123B5C'),
  edge: '#4FA9DE',
  edgeActive: '#8FE3FF',
};

/* ---------------- Especificaciones por tamaño ---------------- */

type CarType = 'hatch' | 'sedan' | 'suv' | 'van';

type CarSpec = {
  type: CarType;
  length: number; // metros
  width: number;
  height: number;
  wheelR: number;
  frontAxle: number; // x normalizado 0(frontal)–1(trasera)
  rearAxle: number;
  seatRows: number[]; // x normalizado de cada fila
  dashX: number;
  trunkX: number;
  cabinEyeX: number; // posición de la cámara interior (x normalizado)
};

const SPECS: Record<SizeId, CarSpec> = {
  S: { type: 'hatch', length: 4.0, width: 1.74, height: 1.48, wheelR: 0.3, frontAxle: 0.17, rearAxle: 0.83, seatRows: [0.5, 0.72], dashX: 0.4, trunkX: 0.9, cabinEyeX: 0.62 },
  M: { type: 'sedan', length: 4.5, width: 1.84, height: 1.44, wheelR: 0.32, frontAxle: 0.16, rearAxle: 0.8, seatRows: [0.46, 0.66], dashX: 0.37, trunkX: 0.9, cabinEyeX: 0.58 },
  L: { type: 'suv', length: 4.75, width: 1.93, height: 1.72, wheelR: 0.37, frontAxle: 0.17, rearAxle: 0.8, seatRows: [0.44, 0.63, 0.79], dashX: 0.35, trunkX: 0.89, cabinEyeX: 0.56 },
  XL: { type: 'van', length: 5.1, width: 1.97, height: 1.92, wheelR: 0.36, frontAxle: 0.15, rearAxle: 0.82, seatRows: [0.34, 0.54, 0.74], dashX: 0.26, trunkX: 0.9, cabinEyeX: 0.5 },
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

/* ---------------- Geometría: perfil lateral con pasos de rueda ---------------- */

function buildBodyShape(spec: CarSpec): THREE.Shape {
  const { length: L, height: H, wheelR, frontAxle, rearAxle, type } = spec;
  const X = (n: number) => n * L - L / 2;
  const Y = (n: number) => n * H;
  const s = new THREE.Shape();
  const y0 = Y(0.12); // bajos
  const archR = wheelR * 1.18;

  // Silueta superior: del morro (izq) a la trasera (der)
  if (type === 'hatch') {
    s.moveTo(X(0), y0 + 0.06);
    s.quadraticCurveTo(X(0), Y(0.4), X(0.05), Y(0.44));
    s.quadraticCurveTo(X(0.2), Y(0.5), X(0.34), Y(0.52)); // capó
    s.quadraticCurveTo(X(0.42), Y(0.54), X(0.5), Y(0.92)); // parabrisas
    s.quadraticCurveTo(X(0.56), Y(1.0), X(0.66), Y(1.0)); // techo
    s.lineTo(X(0.82), Y(0.97));
    s.quadraticCurveTo(X(0.94), Y(0.9), X(0.97), Y(0.52)); // portón
    s.quadraticCurveTo(X(1), Y(0.46), X(1), y0 + 0.06);
  } else if (type === 'sedan') {
    s.moveTo(X(0), y0 + 0.06);
    s.quadraticCurveTo(X(0), Y(0.38), X(0.05), Y(0.42));
    s.quadraticCurveTo(X(0.2), Y(0.47), X(0.33), Y(0.49)); // capó largo
    s.quadraticCurveTo(X(0.4), Y(0.51), X(0.48), Y(0.9)); // parabrisas
    s.quadraticCurveTo(X(0.54), Y(0.97), X(0.63), Y(0.97)); // techo
    s.quadraticCurveTo(X(0.74), Y(0.95), X(0.84), Y(0.56)); // luneta
    s.quadraticCurveTo(X(0.95), Y(0.52), X(0.99), Y(0.48)); // maletero
    s.quadraticCurveTo(X(1), Y(0.44), X(1), y0 + 0.06);
  } else if (type === 'suv') {
    s.moveTo(X(0), y0 + 0.06);
    s.quadraticCurveTo(X(0), Y(0.44), X(0.05), Y(0.5));
    s.quadraticCurveTo(X(0.18), Y(0.56), X(0.3), Y(0.58)); // capó alto
    s.quadraticCurveTo(X(0.37), Y(0.6), X(0.45), Y(0.95)); // parabrisas
    s.quadraticCurveTo(X(0.5), Y(1.0), X(0.6), Y(1.0)); // techo largo
    s.lineTo(X(0.9), Y(0.96));
    s.quadraticCurveTo(X(0.98), Y(0.92), X(0.99), Y(0.56)); // portón vertical
    s.quadraticCurveTo(X(1), Y(0.5), X(1), y0 + 0.06);
  } else {
    // van: morro corto y caja alta
    s.moveTo(X(0), y0 + 0.06);
    s.quadraticCurveTo(X(0), Y(0.46), X(0.04), Y(0.54));
    s.quadraticCurveTo(X(0.1), Y(0.6), X(0.16), Y(0.62)); // capó corto
    s.quadraticCurveTo(X(0.2), Y(0.66), X(0.27), Y(0.96)); // parabrisas tendido
    s.quadraticCurveTo(X(0.3), Y(1.0), X(0.4), Y(1.0)); // techo plano largo
    s.lineTo(X(0.94), Y(1.0));
    s.quadraticCurveTo(X(0.995), Y(0.97), X(1), Y(0.55)); // trasera vertical
    s.lineTo(X(1), y0 + 0.06);
  }

  // Bajos, con arcos sobre las ruedas (de atrás hacia delante)
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
  const { length: L, height: H, type } = spec;
  const X = (n: number) => n * L - L / 2;
  const Y = (n: number) => n * H;
  const s = new THREE.Shape();
  const pts: [number, number][] =
    type === 'hatch'
      ? [ [0.38, 0.56], [0.51, 0.89], [0.66, 0.95], [0.81, 0.92], [0.93, 0.56] ]
      : type === 'sedan'
        ? [ [0.36, 0.53], [0.49, 0.87], [0.63, 0.92], [0.73, 0.9], [0.83, 0.56] ]
        : type === 'suv'
          ? [ [0.33, 0.62], [0.46, 0.92], [0.6, 0.95], [0.88, 0.91], [0.96, 0.62] ]
          : [ [0.2, 0.66], [0.28, 0.92], [0.4, 0.95], [0.92, 0.95], [0.97, 0.66] ];
  pts.forEach(([px, py], i) => (i === 0 ? s.moveTo(X(px), Y(py)) : s.lineTo(X(px), Y(py))));
  s.closePath();
  return s;
}

function extrude(shape: THREE.Shape, width: number) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 16,
  });
  geo.translate(0, 0, -width / 2);
  return geo;
}

/* ---------------- Rueda completa (neumático + llanta + radios) ---------------- */

function Wheel({ spec, x, side, active }: { spec: CarSpec; x: number; side: 1 | -1; active: boolean }) {
  const geos = React.useMemo(() => {
    const r = spec.wheelR;
    return {
      tire: new THREE.TorusGeometry(r * 0.82, r * 0.26, 14, 36),
      rim: new THREE.CylinderGeometry(r * 0.56, r * 0.56, r * 0.34, 20),
      hub: new THREE.CylinderGeometry(r * 0.12, r * 0.12, r * 0.4, 10),
      spoke: new THREE.BoxGeometry(r * 0.14, r * 1.0, r * 0.1),
    };
  }, [spec]);
  React.useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  const z = (spec.width / 2) * 0.86 * side;
  return (
    <group position={[x, spec.wheelR, z]}>
      <HoloMesh geometry={geos.tire} active={active} baseOpacity={0.25} />
      <HoloMesh geometry={geos.rim} active={active} baseOpacity={0.28} rotation={[Math.PI / 2, 0, 0]} showEdges={false} />
      <HoloMesh geometry={geos.hub} active={active} baseOpacity={0.4} rotation={[Math.PI / 2, 0, 0]} showEdges={false} />
      {[0, 1, 2].map((i) => (
        <HoloMesh
          key={i}
          geometry={geos.spoke}
          active={active}
          baseOpacity={0.32}
          showEdges={false}
          rotation={[0, 0, (i * Math.PI) / 3]}
        />
      ))}
    </group>
  );
}

/* ---------------- Modelo completo ---------------- */

function CarModel({ size, activeParts, xray }: { size: SizeId; activeParts: Set<PartId>; xray: boolean }) {
  const spec = SPECS[size];
  const L = spec.length;
  const X = (n: number) => n * L - L / 2;

  const geos = React.useMemo(() => {
    const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
    return {
      body: extrude(buildBodyShape(spec), spec.width),
      glass: extrude(buildGlassShape(spec), spec.width * 0.86),
      door: box(L * 0.3, spec.height * 0.32, 0.02),
      bumperF: box(0.16, spec.height * 0.18, spec.width * 0.94),
      bumperR: box(0.16, spec.height * 0.18, spec.width * 0.94),
      engine: box(L * 0.17, spec.height * 0.24, spec.width * 0.52),
      seatBase: box(L * 0.1, 0.12, spec.width * 0.3),
      seatBack: box(L * 0.04, spec.height * 0.26, spec.width * 0.3),
      bench: box(L * 0.1, 0.12, spec.width * 0.68),
      benchBack: box(L * 0.04, spec.height * 0.24, spec.width * 0.68),
      dash: box(L * 0.05, spec.height * 0.16, spec.width * 0.76),
      wheelSteer: new THREE.TorusGeometry(0.17, 0.025, 8, 20),
      floor: box(L * 0.5, 0.04, spec.width * 0.78),
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
      <HoloMesh geometry={geos.engine} active={on('engine')} baseOpacity={0.26} position={[X(spec.frontAxle + 0.02), spec.height * 0.32, 0]} />
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
