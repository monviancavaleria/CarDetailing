import React from 'react';
import type { SizeId } from '../data/services';
import carS from '../assets/holo/car-s.jpg';
import carM from '../assets/holo/car-m.jpg';
import carL from '../assets/holo/car-l.jpg';
import carXL from '../assets/holo/car-xl.jpg';

/**
 * Coche "radiografía" del cotizador: ilustración holográfica realista por
 * tamaño (S/M/L/XL) + halos de neón superpuestos que iluminan la pieza
 * correspondiente a cada servicio seleccionado. Sin WebGL: funciona en
 * cualquier navegador y pesa poco.
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

/** Qué piezas ilumina cada servicio del cotizador. */
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

const IMAGES: Record<SizeId, string> = { S: carS, M: carM, L: carL, XL: carXL };

type Spot = { x: number; y: number; r: number }; // % del contenedor

/**
 * Posición de los halos por pieza (coordenadas % sobre la imagen).
 * Las cuatro ilustraciones comparten encuadre (3/4 frontal-izquierdo),
 * así que un mapa común con pequeños ajustes por tamaño es suficiente.
 */
const BASE_SPOTS: Record<PartId, Spot[]> = {
  wheels: [
    { x: 51, y: 70, r: 15 },
    { x: 90, y: 51, r: 11 },
  ],
  engine: [{ x: 24, y: 50, r: 17 }],
  glass: [
    { x: 44, y: 31, r: 13 },
    { x: 73, y: 29, r: 11 },
  ],
  seats: [
    { x: 56, y: 33, r: 10 },
    { x: 71, y: 33, r: 10 },
    { x: 81, y: 30, r: 8 },
  ],
  dashboard: [{ x: 47, y: 38, r: 9 }],
  doors: [
    { x: 62, y: 48, r: 12 },
    { x: 77, y: 41, r: 10 },
  ],
  floor: [{ x: 64, y: 52, r: 13 }],
  trunk: [{ x: 91, y: 37, r: 11 }],
  trim: [
    { x: 16, y: 66, r: 12 },
    { x: 97, y: 44, r: 7 },
  ],
  // Carrocería: halo amplio y suave sobre todo el coche
  body: [
    { x: 40, y: 45, r: 26 },
    { x: 72, y: 38, r: 22 },
  ],
};

/** Ajustes puntuales donde la silueta difiere del encuadre común. */
const OVERRIDES: Partial<Record<SizeId, Partial<Record<PartId, Spot[]>>>> = {
  XL: {
    // En la furgoneta los asientos ocupan más habitáculo
    seats: [
      { x: 45, y: 32, r: 9 },
      { x: 62, y: 34, r: 10 },
      { x: 79, y: 31, r: 10 },
    ],
    engine: [{ x: 20, y: 51, r: 15 }],
    trunk: [{ x: 94, y: 40, r: 9 }],
    glass: [
      { x: 38, y: 30, r: 12 },
      { x: 74, y: 28, r: 12 },
    ],
  },
};

function spotsFor(size: SizeId, part: PartId): Spot[] {
  return OVERRIDES[size]?.[part] ?? BASE_SPOTS[part];
}

const ALL_PARTS = Object.keys(BASE_SPOTS) as PartId[];

export default function HoloCarXray({
  size,
  selectedServices,
}: {
  size: SizeId;
  selectedServices: Set<string>;
  zone?: 'exterior' | 'interior';
}) {
  const activeParts = React.useMemo(() => {
    const parts = new Set<PartId>();
    selectedServices.forEach((id) => SERVICE_PARTS[id]?.forEach((p) => parts.add(p)));
    return parts;
  }, [selectedServices]);

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none" aria-hidden>
      {/* Ilustraciones apiladas con fundido para cambiar de tamaño sin parpadeo */}
      <div className="relative w-full aspect-square">
        {(Object.keys(IMAGES) as SizeId[]).map((s) => (
          <img
            key={s}
            src={IMAGES[s]}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
            style={{ opacity: s === size ? 1 : 0 }}
            loading={s === 'S' ? 'eager' : 'lazy'}
          />
        ))}

        {/* Halos de neón por pieza */}
        {ALL_PARTS.map((part) =>
          spotsFor(size, part).map((spot, i) => {
            const on = activeParts.has(part);
            const d = spot.r * 2;
            return (
              <div
                key={`${part}-${i}`}
                className={`absolute rounded-full pointer-events-none ${on ? 'holo-glow--on' : ''}`}
                style={{
                  left: `${spot.x - spot.r}%`,
                  top: `${spot.y - spot.r}%`,
                  width: `${d}%`,
                  height: `${d}%`,
                  opacity: on ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                  background:
                    part === 'body'
                      ? 'radial-gradient(circle, rgba(79,195,255,0.34) 0%, rgba(55,182,255,0.14) 45%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(127,219,255,0.6) 0%, rgba(55,182,255,0.28) 40%, transparent 70%)',
                  mixBlendMode: 'screen',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
