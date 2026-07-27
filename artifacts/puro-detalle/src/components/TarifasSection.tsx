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
  LayoutGrid,
  MessageCircle,
  Plus,
  X,
} from 'lucide-react';

/**
 * Sección #tarifas de la landing: plan de servicios (qué incluye cada paquete)
 * primero y, debajo, la matriz de precios por tamaño de vehículo.
 * `highlighted` (id de paquete) resalta la columna correspondiente; se activa
 * desde los botones "Más información" de las tarjetas de paquetes. Al haber
 * un paquete activo, solo se muestran las columnas de su categoría
 * (Mantenimiento o Detallado) para aligerar la sección; `onClear` vuelve a
 * la comparativa completa.
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
    badge: 'La preferida',
  },
];

const SIZES: {
  label: string;
  desc: string;
  Icon: typeof Car;
  prices: [string, string, string, string];
}[] = [
  { label: 'S', desc: '< 4,20 m · Urbano · Compacto', Icon: Car, prices: ['35 €', '49 €', '89 €', '139 €'] },
  { label: 'M', desc: '4,20 – 4,60 m · Turismo', Icon: Car, prices: ['39 €', '54 €', '99 €', '149 €'] },
  { label: 'L', desc: '4,60 – 4,90 m · SUV · Familiar', Icon: CarFront, prices: ['45 €', '64 €', '109 €', '159 €'] },
  { label: 'XL', desc: '> 4,90 m · SUV grande · 7 plazas', Icon: Bus, prices: ['55 €', '74 €', '119 €', '169 €'] },
];

type Level = 'full' | 'basic' | 'extra' | 'none';

const LEVEL_LABEL: Record<Level, string> = {
  full: 'Nivel completo',
  basic: 'Nivel básico',
  extra: 'Extra opcional',
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
      { label: 'Desinfección con vapor', levels: ['none', 'none', 'full', 'full'] },
    ],
  },
  {
    title: 'Solo Platinum',
    rows: [
      { label: 'Lavado de motor', levels: ['none', 'none', 'none', 'extra'] },
      { label: 'Limpieza de cuero', levels: ['none', 'none', 'none', 'full'] },
      { label: 'Acond. e hidrat. cuero', levels: ['none', 'none', 'none', 'full'] },
    ],
  },
];

function LevelIcon({ level }: { level: Level }) {
  if (level === 'full') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#96DCF6] shadow-[0_2px_10px_rgba(150,220,246,0.6)]">
        <Check className="w-3.5 h-3.5 text-[#05435C]" strokeWidth={3} />
        <span className="sr-only">{LEVEL_LABEL.full}</span>
      </span>
    );
  }
  if (level === 'extra') {
    return <ExtraIcon />;
  }
  if (level === 'basic') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/50 border border-[#8C96A3]/80">
        <Check className="w-3.5 h-3.5 text-[#0077D6]" strokeWidth={3} />
        <span className="sr-only">{LEVEL_LABEL.basic}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#8C96A3]/70 bg-white/30">
      <X className="w-3.5 h-3.5 text-[#4A5462]" strokeWidth={2.75} />
      <span className="sr-only">{LEVEL_LABEL.none}</span>
    </span>
  );
}

const EXTRA_INFO = 'El extra de lavado de motor tiene un coste fijo de +30 euros';

/** Icono "+" (extra opcional): al pulsarlo muestra el coste del extra. */
function ExtraIcon() {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${LEVEL_LABEL.extra}: ver coste`}
        className="relative inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#0077D6]/60 bg-[#0077D6]/10 cursor-pointer shadow-[0_2px_10px_rgba(0,119,214,0.35)] hover:bg-[#0077D6]/20 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#0077D6]/60 focus-visible:outline-offset-2 transition-all"
      >
        {/* Halo pulsante: señala que el icono es pulsable */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#0077D6]/30 animate-ping [animation-duration:2.2s]"
        />
        <Plus className="relative w-3.5 h-3.5 text-[#4FA9DE]" strokeWidth={3} />
      </button>
      {open && (
        <span
          role="status"
          className="absolute bottom-full right-[-10px] mb-3 z-20 w-64 rounded-xl bg-[#15181D] text-white text-sm font-sans font-medium leading-relaxed px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.35)] normal-case tracking-normal text-center"
        >
          {EXTRA_INFO}
          <span className="absolute top-full right-[16px] border-8 border-transparent border-t-[#15181D]" />
        </span>
      )}
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
      <span className="text-[#96DCF6]" aria-hidden>★ </span>{pkg.badge}
      </span>
      )}
      <span
        className={`font-serif uppercase tracking-wider text-sm md:text-base leading-tight ${
          isBlue ? 'text-[#4FA9DE]' : 'text-[#4A5462]'
        }`}
      >
        {pkg.name}
      </span>
      {pkg.note && (
        <span className="text-[10px] text-muted-foreground font-sans italic">{pkg.note}</span>
      )}
      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-sans">
        <Clock className="w-3 h-3 text-[#96DCF6]" />
        {pkg.duration}
      </span>
    </div>
  );
}

export default function TarifasSection({
  highlighted,
  category,
  onClear,
}: {
  highlighted: string | null;
  /** Categoría activa desde las pestañas de paquetes (sin paquete concreto). */
  category?: 'detallado' | 'mantenimiento' | null;
  onClear?: () => void;
}) {
  const activePkg = PACKAGES.find((pkg) => pkg.id === highlighted) ?? null;
  const activeId = activePkg?.id ?? null;

  /* Categoría a filtrar: la del paquete activo o la de la pestaña elegida */
  const activeKind: Pkg['kind'] | null =
    activePkg?.kind ??
    (category === 'detallado' ? 'blue' : category === 'mantenimiento' ? 'silver' : null);

  /* Columnas visibles: todas, o solo las de la categoría activa */
  const cols = PACKAGES.map((pkg, idx) => ({ pkg, idx })).filter(
    ({ pkg }) => !activeKind || pkg.kind === activeKind,
  );
  const isFiltered = cols.length < PACKAGES.length;

  /* Con la vista filtrada se ocultan las filas donde nada está incluido */
  const groups = SERVICE_GROUPS.map((group) => ({
    ...group,
    rows: isFiltered
      ? group.rows.filter((row) => cols.some(({ idx }) => row.levels[idx] !== 'none'))
      : group.rows,
  })).filter((group) => group.rows.length > 0);

  const colWidth = isFiltered ? 'w-[34%]' : 'w-[17%]';
  const priceColWidth = isFiltered ? 'w-[34%]' : 'w-1/5';
  const tableMinWidth = isFiltered ? 'min-w-[520px]' : 'min-w-[680px]';

  const colTint = (pkg: Pkg) =>
    activeId === pkg.id
      ? pkg.kind === 'blue'
        ? 'bg-[#0077D6]/[0.06]'
        : 'bg-[#8C96A3]/10'
      : '';

  /* ---------- Bloque: plan de servicios ---------- */
  const planBlock = (
    <div>
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
            className="font-script italic text-2xl md:text-3xl text-[#4FA9DE] mt-3"
          >
            Qué incluye exactamente cada paquete
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-4 sm:p-6 lg:p-8 overflow-x-auto"
        >
          <table className={`w-full ${tableMinWidth} border-separate border-spacing-x-2 border-spacing-y-0`}>
            <caption className="sr-only">
              Servicios incluidos en cada paquete: nivel completo, nivel básico, extra opcional o no incluido
            </caption>
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Servicio
                </th>
                {cols.map(({ pkg }) => (
                  <th key={pkg.id} scope="col" className={`${colWidth} align-bottom pt-3 pb-2`}>
                    <PkgHeader pkg={pkg} highlighted={activeId === pkg.id} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group, gi) => (
                <React.Fragment key={group.title ?? gi}>
                  {group.title && (
                    <tr>
                      <td colSpan={cols.length + 1} className="pt-8 pb-3">
                        <div className="flex items-center gap-4">
                          <span className="h-px flex-1 bg-[#0077D6]/15" />
                          <span className="text-xs tracking-[0.25em] uppercase font-sans font-semibold text-[#4FA9DE]">
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
                      {cols.map(({ pkg, idx }) => (
                        <td
                          key={pkg.id}
                          className={`text-center align-middle py-3 border-b border-[#C9CED6]/40 transition-colors duration-300 ${colTint(pkg)}`}
                        >
                          <LevelIcon level={row.levels[idx]} />
                        </td>
                      ))}
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
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#0077D6]/50 bg-[#0077D6]/10">
                <Plus className="w-3.5 h-3.5 text-[#4FA9DE]" strokeWidth={3} />
              </span>
              Extra opcional
            </span>
            <span className="inline-flex items-center gap-2">
              <LevelIcon level="none" />
              No incluido
            </span>
          </div>
        </motion.div>
    </div>
  );

  /* ---------- Bloque: tarifas ---------- */
  const tarifasBlock = (
    <div>
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
            className="font-script italic text-2xl md:text-3xl text-[#4FA9DE] mt-3"
          >
            Precios según el tamaño de tu vehículo
          </motion.p>
          {isFiltered && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="relative mt-6 inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-[#0077D6]/50 bg-white/60 text-sm tracking-widest uppercase font-sans font-semibold text-[#0077D6] shadow-[0_4px_18px_rgba(0,119,214,0.25)] cursor-pointer hover:bg-[#0077D6]/10 hover:border-[#0077D6] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {/* Halo pulsante: mismo distintivo que el botón "+" del extra */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-[#0077D6]/20 animate-ping [animation-duration:2.2s]"
              />
              <LayoutGrid className="relative w-4 h-4 text-[#96DCF6]" />
              <span className="relative">Ver los 4 paquetes</span>
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 overflow-x-auto"
        >
          <table className={`w-full ${tableMinWidth} border-separate border-spacing-2`}>
            <caption className="sr-only">
              Precios de cada paquete según el tamaño del vehículo
            </caption>
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Tamaño del vehículo
                </th>
                {cols.map(({ pkg }) => (
                  <th key={pkg.id} scope="col" className={`${priceColWidth} align-bottom pt-3`}>
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
                      <Icon className="w-8 h-8 text-[#96DCF6]" strokeWidth={1.5} />
                      <span>
                        <span className="block font-serif uppercase tracking-wider text-xl md:text-2xl text-foreground leading-none">
                          {label}
                        </span>
                        <span className="block text-xs md:text-sm tracking-widest uppercase text-muted-foreground font-sans mt-1">
                          {desc}
                        </span>
                      </span>
                    </span>
                  </th>
                  {cols.map(({ pkg, idx }) => (
                    <td
                      key={pkg.id}
                      className={`text-center align-middle rounded-xl py-5 transition-colors duration-300 ${colTint(pkg)}`}
                    >
                      <span
                        className={`text-2xl md:text-3xl font-light ${
                          pkg.kind === 'blue' ? 'text-[#4FA9DE]' : 'text-[#4A5462]'
                        }`}
                      >
                        {prices[idx]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Notas de tarifas */}
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground font-sans">
          {(!isFiltered || activeKind === 'silver') && (
            <p className="inline-flex items-center gap-2 text-base md:text-lg">
              <Home className="w-4 h-4 text-[#96DCF6]" />
              Servicio de mantenimiento a domicilio · mínimo 2 vehículos
            </p>
          )}
          {(!isFiltered || activeKind === 'blue') && (
            <p className="inline-flex items-center gap-2 text-base md:text-lg">
              <Armchair className="w-4 h-4 text-[#96DCF6]" />
              Boutique Integral · +12,50 € por asiento extra
            </p>
          )}
        </div>
    </div>
  );

  return (
    <section id="tarifas" className="py-24 relative z-10 scroll-mt-20">
      <div className={`${isFiltered ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
        {isFiltered ? (
          <>
            {tarifasBlock}
            <div className="mt-20">{planBlock}</div>
          </>
        ) : (
          <>
            {planBlock}
            <div className="mt-20">{tarifasBlock}</div>
          </>
        )}

        {/* ---------- CTA ---------- */}
        <div className="text-center mt-14">
          <p className="font-script italic text-xl md:text-2xl text-[#4FA9DE] mb-5">
            ¿Dudas sobre qué paquete elegir? Escríbenos y te asesoramos.
          </p>
          <a
            href="https://wa.me/34603533624"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white text-sm tracking-widest uppercase font-medium font-sans hover:brightness-110 transition-all shadow-[0_8px_30px_rgba(0,119,214,0.35)]"
          >
            <MessageCircle className="w-5 h-5 text-[#96DCF6]" />
            Reservar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
