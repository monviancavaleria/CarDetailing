import React from 'react';
import { motion } from 'framer-motion';
import {
  Armchair,
  Bus,
  Car,
  CarFront,
  Check,
  Clock,
  Home,
  MessageCircle,
  X,
} from 'lucide-react';

/**
 * Sección #tarifas de la landing: matriz de precios por tamaño de vehículo
 * y plan de servicios (qué incluye cada paquete y qué no).
 * `highlighted` (id de paquete) resalta la columna correspondiente; se activa
 * desde los botones "Más información" de las tarjetas de paquetes.
 */

type PkgId =
  | 'mantenimiento-basico'
  | 'mantenimiento-profundo'
  | 'boutique-integral'
  | 'platinum';

type Pkg = {
  id: PkgId;
  name: string;
  duration: string;
  kind: 'silver' | 'blue';
  note?: string;
  badge?: string;
};

const PACKAGES: Pkg[] = [
  {
    id: 'mantenimiento-basico',
    name: 'Mantenim. Básico',
    duration: '1 h – 1 h 30',
    kind: 'silver',
  },
  {
    id: 'mantenimiento-profundo',
    name: 'Mantenim. Profundo',
    duration: '1 h 45 – 2 h 30',
    kind: 'silver',
  },
  {
    id: 'boutique-integral',
    name: 'Boutique Integral',
    duration: '4 h – 5 h',
    kind: 'blue',
    note: '1 asiento',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    duration: '5 h – 6 h',
    kind: 'blue',
    note: 'Todos los asientos',
    badge: '★ La preferida',
  },
];

const SIZES: {
  label: string;
  desc: string;
  Icon: typeof Car;
  prices: [string, string, string, string];
}[] = [
  { label: 'S / M', desc: 'Compacto · Turismo', Icon: Car, prices: ['35 €', '55 €', '89 €', '139 €'] },
  { label: 'L', desc: 'SUV · Familiar', Icon: CarFront, prices: ['40 €', '60 €', '99 €', '149 €'] },
  { label: 'XL', desc: 'SUV grande · 7 plazas', Icon: Bus, prices: ['45 €', '65 €', '109 €', '159 €'] },
];

type Level = 'full' | 'basic' | 'none';

const LEVEL_LABEL: Record<Level, string> = {
  full: 'Nivel completo',
  basic: 'Nivel básico',
  none: 'No incluido',
};

const SERVICE_GROUPS: {
  title?: string;
  rows: { label: string; levels: [Level, Level, Level, Level] }[];
}[] = [
  {
    rows: [
      { label: 'Lavado técnico a mano', levels: ['full', 'full', 'full', 'full'] },
      { label: 'Limpieza de llantas', levels: ['basic', 'basic', 'full', 'full'] },
      { label: 'Limpieza de cristales', levels: ['full', 'full', 'full', 'full'] },
      { label: 'Aspirado de habitáculo', levels: ['basic', 'full', 'full', 'full'] },
      { label: 'Limpieza superf. asientos', levels: ['none', 'full', 'full', 'full'] },
      { label: 'Limpieza de puertas', levels: ['none', 'full', 'full', 'full'] },
    ],
  },
  {
    title: 'Servicios Premium',
    rows: [
      { label: 'Sellado pintura SiO₂', levels: ['none', 'none', 'full', 'full'] },
      { label: 'Sellador neumáticos (4 meses)', levels: ['none', 'none', 'full', 'full'] },
      { label: 'Acond. plásticos interiores', levels: ['none', 'none', 'full', 'full'] },
      { label: 'Acond. plásticos exteriores', levels: ['none', 'none', 'full', 'full'] },
      { label: 'Tapicería en profundidad', levels: ['none', 'none', 'full', 'full'] },
      { label: 'Desinfección con vapor', levels: ['none', 'none', 'none', 'full'] },
    ],
  },
  {
    title: 'Solo Platinum',
    rows: [
      { label: 'Lavado de motor', levels: ['none', 'none', 'none', 'full'] },
      { label: 'Limpieza de cuero', levels: ['none', 'none', 'none', 'full'] },
      { label: 'Acond. e hidrat. cuero', levels: ['none', 'none', 'none', 'full'] },
    ],
  },
];

function LevelIcon({ level }: { level: Level }) {
  if (level === 'full') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0077D6] shadow-[0_2px_8px_rgba(0,119,214,0.35)]">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        <span className="sr-only">{LEVEL_LABEL.full}</span>
      </span>
    );
  }
  if (level === 'basic') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C9CED6]/60 border border-[#8C96A3]/60">
        <Check className="w-3.5 h-3.5 text-[#4A5462]" strokeWidth={3} />
        <span className="sr-only">{LEVEL_LABEL.basic}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#C9CED6]/80">
      <X className="w-3.5 h-3.5 text-[#8C96A3]/70" strokeWidth={2.5} />
      <span className="sr-only">{LEVEL_LABEL.none}</span>
    </span>
  );
}

function PkgHeader({ pkg, highlighted }: { pkg: Pkg; highlighted: boolean }) {
  const isBlue = pkg.kind === 'blue';
  return (
    <div
      className={`relative rounded-xl px-3 py-4 h-full flex flex-col items-center justify-center gap-1 text-center transition-all duration-300 ${
        isBlue ? 'glass-blue' : 'glass-silver'
      } ${highlighted ? (isBlue ? 'card-selected-blue' : 'card-selected-silver') : ''}`}
    >
      {pkg.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white text-[9px] font-bold tracking-widest uppercase font-sans shadow-[0_4px_14px_rgba(0,119,214,0.35)]">
      {pkg.badge}
      </span>
      )}
      <span
        className={`font-serif uppercase tracking-wider text-sm md:text-base leading-tight ${
          isBlue ? 'text-[#075A9E]' : 'text-[#4A5462]'
        }`}
      >
        {pkg.name}
      </span>
      {pkg.note && (
        <span className="text-[10px] text-muted-foreground font-sans italic">{pkg.note}</span>
      )}
      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-sans">
        <Clock className="w-3 h-3" />
        {pkg.duration}
      </span>
    </div>
  );
}

export default function TarifasSection({ highlighted }: { highlighted: string | null }) {
  const activeId: PkgId | null = PACKAGES.some((pkg) => pkg.id === highlighted)
    ? (highlighted as PkgId)
    : null;

  const colTint = (pkg: Pkg) =>
    activeId === pkg.id
      ? pkg.kind === 'blue'
        ? 'bg-[#0077D6]/[0.06]'
        : 'bg-[#8C96A3]/10'
      : '';

  return (
    <section id="tarifas" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------- Plan de servicios ---------- */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif uppercase tracking-wider text-foreground"
          >
            Plan de Servicios
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-script italic text-2xl md:text-3xl text-[#0077D6] mt-3"
          >
            Qué incluye exactamente cada paquete
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-4 sm:p-6 lg:p-8 overflow-x-auto mb-20"
        >
          <table className="w-full min-w-[680px] border-separate border-spacing-x-2 border-spacing-y-0">
            <caption className="sr-only">
              Servicios incluidos en cada paquete: nivel completo, nivel básico o no incluido
            </caption>
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Servicio
                </th>
                {PACKAGES.map((pkg) => (
                  <th key={pkg.id} scope="col" className="w-[17%] align-bottom pt-3 pb-2">
                    <PkgHeader pkg={pkg} highlighted={activeId === pkg.id} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SERVICE_GROUPS.map((group, gi) => (
                <React.Fragment key={gi}>
                  {group.title && (
                    <tr>
                      <td colSpan={5} className="pt-8 pb-3">
                        <div className="flex items-center gap-4">
                          <span className="h-px flex-1 bg-[#0077D6]/15" />
                          <span className="text-xs tracking-[0.25em] uppercase font-sans font-semibold text-[#075A9E]">
                            {group.title}
                          </span>
                          <span className="h-px flex-1 bg-[#0077D6]/15" />
                        </div>
                      </td>
                    </tr>
                  )}
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className="text-left font-sans text-sm text-[#4A5462] font-medium py-3 pr-2 border-b border-[#C9CED6]/40"
                      >
                        {row.label}
                      </th>
                      {row.levels.map((level, i) => {
                        const pkg = PACKAGES[i];
                        return (
                          <td
                            key={pkg.id}
                            className={`text-center align-middle py-3 border-b border-[#C9CED6]/40 transition-colors duration-300 ${colTint(pkg)}`}
                          >
                            <LevelIcon level={level} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Leyenda */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-xs text-muted-foreground font-sans">
            <span className="inline-flex items-center gap-2">
              <LevelIcon level="full" />
              Nivel completo
            </span>
            <span className="inline-flex items-center gap-2">
              <LevelIcon level="basic" />
              Nivel básico
            </span>
            <span className="inline-flex items-center gap-2">
              <LevelIcon level="none" />
              No incluido
            </span>
          </div>
        </motion.div>

        {/* ---------- Tarifas ---------- */}
        <div className="text-center mb-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-serif uppercase tracking-wider text-foreground"
          >
            Tarifas
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-script italic text-2xl md:text-3xl text-[#0077D6] mt-3"
          >
            Precios según el tamaño de tu vehículo
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 overflow-x-auto"
        >
          <table className="w-full min-w-[680px] border-separate border-spacing-2">
            <caption className="sr-only">
              Precios de cada paquete según el tamaño del vehículo
            </caption>
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Tamaño del vehículo
                </th>
                {PACKAGES.map((pkg) => (
                  <th key={pkg.id} scope="col" className="w-1/5 align-bottom pt-3">
                    <PkgHeader pkg={pkg} highlighted={activeId === pkg.id} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map(({ label, desc, Icon, prices }) => (
                <tr key={label}>
                  <th scope="row" className="text-left align-middle py-4 pr-2">
                    <span className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-[#0077D6]" strokeWidth={1.5} />
                      <span>
                        <span className="block font-serif uppercase tracking-wider text-lg text-foreground leading-none">
                          {label}
                        </span>
                        <span className="block text-[10px] tracking-widest uppercase text-muted-foreground font-sans mt-1">
                          {desc}
                        </span>
                      </span>
                    </span>
                  </th>
                  {prices.map((price, i) => {
                    const pkg = PACKAGES[i];
                    return (
                      <td
                        key={pkg.id}
                        className={`text-center align-middle rounded-xl py-5 transition-colors duration-300 ${colTint(pkg)}`}
                      >
                        <span
                          className={`text-2xl md:text-3xl font-light ${
                            pkg.kind === 'blue' ? 'text-[#0077D6]' : 'text-[#4A5462]'
                          }`}
                        >
                          {price}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Notas de tarifas */}
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground font-sans">
          <p className="inline-flex items-center gap-2">
            <Home className="w-4 h-4 text-[#0077D6]" />
            Servicio de mantenimiento a domicilio · mínimo 2 vehículos
          </p>
          <p className="inline-flex items-center gap-2">
            <Armchair className="w-4 h-4 text-[#0077D6]" />
            Boutique Integral · +12,50 € por asiento extra
          </p>
        </div>

        {/* ---------- CTA ---------- */}
        <div className="text-center mt-14">
          <p className="font-script italic text-xl md:text-2xl text-[#0077D6] mb-5">
            ¿Dudas sobre qué paquete elegir? Escríbenos y te asesoramos.
          </p>
          <a
            href="https://wa.me/34603533624"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white text-sm tracking-widest uppercase font-medium font-sans hover:brightness-110 transition-all shadow-[0_8px_30px_rgba(0,119,214,0.35)]"
          >
            <MessageCircle className="w-5 h-5" />
            Reservar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
