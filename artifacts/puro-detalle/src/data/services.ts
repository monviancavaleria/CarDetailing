/**
 * Datos de servicios y tarifas de Puro Detalle.
 * ÚNICO sitio donde tocar precios, tiempos y textos de la oferta.
 * Fuente: infografías oficiales (ago 2026).
 */

/* ---------------------------------------------------------------- */
/* Categorías y paquetes cerrados                                    */
/* ---------------------------------------------------------------- */

export type CategoryId = 'completo' | 'interior' | 'mantenimiento';

export type TierId =
  | 'mantenimiento-basico'
  | 'mantenimiento-profundo'
  | 'boutique'
  | 'platinum'
  | 'detallado-interior'
  | 'interior-integral';

export type Tier = {
  id: TierId;
  name: string;
  duration: string;
  note?: string;
  badge?: string;
  /** Precio "desde" (tamaño S) para la tarjeta del paquete. */
  fromPrice: string;
  description: string;
  tagline: string;
};

export type Level = 'full' | 'basic' | 'extra' | 'none';

export type Category = {
  id: CategoryId;
  label: string;
  kind: 'blue' | 'silver';
  tiers: [Tier, Tier];
  /** Matriz de servicios incluidos [tier1, tier2]. */
  serviceGroups: { title?: string; rows: { label: string; levels: [Level, Level] }[] }[];
  /** Precios por tamaño S/M/L/XL: [tier1, tier2]. */
  sizePrices: { size: SizeId; prices: [string, string] }[];
  footnote?: string;
};

export type SizeId = 'S' | 'M' | 'L' | 'XL';

export const SIZE_INFO: Record<SizeId, { desc: string }> = {
  S: { desc: '< 4,20 m · Urbano · Compacto' },
  M: { desc: '4,20 – 4,60 m · Turismo' },
  L: { desc: '4,60 – 4,90 m · SUV · Familiar' },
  XL: { desc: '> 4,90 m · SUV grande · 7 plazas' },
};

const EXTERIOR_ROWS = (a: Level, b: Level, motorA: Level, motorB: Level) => [
  { label: 'Lavado técnico a mano', levels: [a, b] as [Level, Level] },
  { label: 'Limpieza de llantas', levels: [a, b] as [Level, Level] },
  { label: 'Cristales exteriores', levels: [a, b] as [Level, Level] },
  { label: 'Sellado pintura SiO₂', levels: [a, b] as [Level, Level] },
  { label: 'Sellador neumáticos (4 meses)', levels: [a, b] as [Level, Level] },
  { label: 'Acond. plásticos exteriores', levels: [a, b] as [Level, Level] },
  { label: 'Lavado de motor (básico)', levels: [motorA, motorB] as [Level, Level] },
];

const INTERIOR_ROWS = (a: Level, b: Level) => [
  { label: 'Aspirado de habitáculo', levels: [a, b] as [Level, Level] },
  { label: 'Cristales interiores', levels: [a, b] as [Level, Level] },
  { label: 'Limpieza de puertas', levels: [a, b] as [Level, Level] },
  { label: 'Acond. plásticos interiores', levels: [a, b] as [Level, Level] },
  { label: 'Desinfección con vapor', levels: [a, b] as [Level, Level] },
];

export const CATEGORIES: Category[] = [
  {
    id: 'completo',
    label: 'Detallado Completo',
    kind: 'blue',
    tiers: [
      {
        id: 'boutique',
        name: 'Detallado Boutique',
        duration: '4 h – 5 h',
        note: 'Sin asientos',
        fromPrice: '99€',
        description:
          'Detallado exterior e interior al completo: carrocería sellada con SiO₂, llantas, cristales y habitáculo impecables.',
        tagline: 'Tu coche, como el primer día.',
      },
      {
        id: 'platinum',
        name: 'Detallado Platinum',
        duration: '6 h – 8 h',
        note: 'Todos los asientos',
        badge: 'La preferida',
        fromPrice: '189€',
        description:
          'La experiencia completa: todo lo del Boutique más tapicería en profundidad, cuidado del cuero y lavado de motor.',
        tagline: 'La sensación de estreno, sin salir de casa.',
      },
    ],
    serviceGroups: [
      { title: 'Exterior', rows: EXTERIOR_ROWS('full', 'full', 'none', 'full') },
      { title: 'Interior', rows: INTERIOR_ROWS('full', 'full') },
      {
        title: 'Tapicería',
        rows: [
          { label: 'Limpieza superf. asientos', levels: ['none', 'full'] },
          { label: 'Tapicería en profundidad', levels: ['none', 'full'] },
          { label: 'Limpieza de cuero', levels: ['none', 'full'] },
          { label: 'Acond. e hidrat. cuero', levels: ['none', 'full'] },
        ],
      },
    ],
    sizePrices: [
      { size: 'S', prices: ['99 €', '189 €'] },
      { size: 'M', prices: ['109 €', '204 €'] },
      { size: 'L', prices: ['119 €', '219 €'] },
      { size: 'XL', prices: ['129 €', '234 €'] },
    ],
    footnote: 'El Boutique no incluye asientos · añádelos con las tarifas de tapicería',
  },
  {
    id: 'interior',
    label: 'Detallado Interior',
    kind: 'blue',
    tiers: [
      {
        id: 'detallado-interior',
        name: 'Detallado Interior',
        duration: '3 h – 4 h 30',
        note: 'Sin asientos',
        fromPrice: '59€',
        description:
          'El habitáculo a fondo: aspirado, cristales, puertas, plásticos y desinfección con vapor. El exterior no se toca.',
        tagline: 'Por dentro, impecable.',
      },
      {
        id: 'interior-integral',
        name: 'Interior Integral',
        duration: '4 h 30 – 6 h',
        note: 'Todos los asientos',
        badge: 'Más completo',
        fromPrice: '119€',
        description:
          'Todo lo del Interior más la tapicería en profundidad y el cuidado completo del cuero de todos los asientos.',
        tagline: 'Un interior de estreno.',
      },
    ],
    serviceGroups: [
      { title: 'Interior', rows: INTERIOR_ROWS('full', 'full') },
      {
        title: 'Tapicería',
        rows: [
          { label: 'Limpieza superf. asientos', levels: ['basic', 'full'] },
          { label: 'Tapicería en profundidad', levels: ['none', 'full'] },
          { label: 'Limpieza de cuero', levels: ['none', 'full'] },
          { label: 'Acond. e hidrat. cuero', levels: ['none', 'full'] },
        ],
      },
    ],
    sizePrices: [
      { size: 'S', prices: ['59 €', '119 €'] },
      { size: 'M', prices: ['69 €', '129 €'] },
      { size: 'L', prices: ['79 €', '139 €'] },
      { size: 'XL', prices: ['89 €', '149 €'] },
    ],
    footnote: 'El Detallado Interior no incluye asientos · añádelos con las tarifas de tapicería',
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento',
    kind: 'silver',
    tiers: [
      {
        id: 'mantenimiento-basico',
        name: 'Mantenimiento Básico',
        duration: '1 h – 1 h 30',
        fromPrice: '35€',
        description:
          'El lavado esencial para el día a día: carrocería, llantas y cristales limpios, y el interior aspirado.',
        tagline: 'Tu coche siempre presentable.',
      },
      {
        id: 'mantenimiento-profundo',
        name: 'Mantenimiento Profundo',
        duration: '1 h 45 – 2 h 30',
        fromPrice: '49€',
        description:
          'Todo lo del Básico y un paso más: aspirado completo del habitáculo y limpieza de la superficie de asientos y puertas.',
        tagline: 'Una limpieza a fondo, por dentro y por fuera.',
      },
    ],
    serviceGroups: [
      {
        rows: [
          { label: 'Lavado técnico a mano', levels: ['full', 'full'] },
          { label: 'Limpieza de llantas', levels: ['basic', 'basic'] },
          { label: 'Limpieza de cristales', levels: ['full', 'full'] },
          { label: 'Aspirado de habitáculo', levels: ['basic', 'full'] },
          { label: 'Limpieza superf. asientos', levels: ['none', 'full'] },
          { label: 'Limpieza de puertas', levels: ['none', 'full'] },
        ],
      },
    ],
    sizePrices: [
      { size: 'S', prices: ['35 €', '49 €'] },
      { size: 'M', prices: ['39 €', '54 €'] },
      { size: 'L', prices: ['45 €', '60 €'] },
      { size: 'XL', prices: ['55 €', '69 €'] },
    ],
    footnote: 'Servicio a domicilio · mínimo 2 vehículos',
  },
];

/* ---------------------------------------------------------------- */
/* Extras: tapicería (asientos) y motor                              */
/* ---------------------------------------------------------------- */

export const TAPICERIA_EXTRA = {
  cols: ['1 asiento', 'Pack 2 asientos', 'Todos los asientos'],
  rows: [
    { label: 'Tela', prices: ['25 €', '45 €', '79 €'] },
    { label: 'Cuero', prices: ['30 €', '50 €', '89 €'] },
  ],
  note: 'Se añaden a cualquier servicio de mantenimiento o detallado',
};

export const MOTOR_EXTRA = [
  {
    name: 'Lavado de motor básico',
    duration: '30 – 45 min',
    price: '35 €',
    description: 'Desengrasado del vano, aclarado y secado protegiendo las zonas sensibles.',
  },
  {
    name: 'Detallado de motor a vapor',
    duration: '1 h 15 – 1 h 45',
    price: '60 €',
    description: 'Vapor en profundidad, detallado de recovecos y acondicionado de plásticos y gomas.',
  },
];

/* ---------------------------------------------------------------- */
/* Cotizador personalizado                                           */
/* ---------------------------------------------------------------- */

/**
 * PRECIOS Y TIEMPOS PROVISIONALES del cotizador.
 * `price` en euros y `minutes` en minutos; cambia aquí los valores
 * definitivos cuando los tengas. Un valor `null` se muestra como
 * "a confirmar" y no suma al total.
 */
export type CustomService = {
  id: string;
  label: string;
  zone: 'exterior' | 'interior';
  price: number | null;
  minutes: number | null;
};

export const CUSTOM_SERVICES: CustomService[] = [
  // ---------- EXTERIOR ----------
  { id: 'lavado-mano', label: 'Lavado técnico a mano', zone: 'exterior', price: 30, minutes: 60 },
  { id: 'llantas', label: 'Limpieza de llantas', zone: 'exterior', price: 15, minutes: 30 },
  { id: 'cristales-ext', label: 'Cristales exteriores', zone: 'exterior', price: 10, minutes: 20 },
  { id: 'sellado-sio2', label: 'Sellado pintura SiO₂', zone: 'exterior', price: 40, minutes: 60 },
  { id: 'sellador-neumaticos', label: 'Sellador de neumáticos', zone: 'exterior', price: 10, minutes: 15 },
  { id: 'plasticos-ext', label: 'Acond. plásticos exteriores', zone: 'exterior', price: 15, minutes: 25 },
  { id: 'motor-basico', label: 'Lavado de motor básico', zone: 'exterior', price: 35, minutes: 40 },
  { id: 'motor-vapor', label: 'Detallado de motor a vapor', zone: 'exterior', price: 60, minutes: 90 },
  // ---------- INTERIOR ----------
  { id: 'aspirado', label: 'Aspirado de habitáculo', zone: 'interior', price: 20, minutes: 30 },
  { id: 'cristales-int', label: 'Cristales interiores', zone: 'interior', price: 10, minutes: 15 },
  { id: 'puertas', label: 'Limpieza de puertas', zone: 'interior', price: 10, minutes: 20 },
  { id: 'plasticos-int', label: 'Acond. plásticos interiores', zone: 'interior', price: 15, minutes: 25 },
  { id: 'vapor', label: 'Desinfección con vapor', zone: 'interior', price: 25, minutes: 40 },
  { id: 'asientos-tela', label: 'Asientos de tela (todos)', zone: 'interior', price: 79, minutes: 90 },
  { id: 'asientos-cuero', label: 'Limpieza y cuidado del cuero', zone: 'interior', price: 89, minutes: 100 },
];

export const WA_PHONE = '34603533624';
