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
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  MOTOR_EXTRA,
  SIZE_INFO,
  TAPICERIA_EXTRA,
  WA_PHONE,
  type Category,
  type CategoryId,
  type Level,
  type Tier,
  type TierId,
} from '../data/services';

/**
 * Sección #tarifas de la landing: por categoría (Detallado Completo,
 * Detallado Interior o Mantenimiento) muestra el plan de servicios
 * (qué incluye cada nivel) y la matriz de precios por tamaño.
 * Debajo, los bloques de Servicios Extra (tapicería y motor), comunes.
 * `highlighted` (id de paquete) resalta la columna correspondiente.
 */

const SIZE_ICON: Record<string, typeof Car> = { S: Car, M: Car, L: CarFront, XL: Bus };

const LEVEL_LABEL: Record<Level, string> = {
  full: 'Nivel completo',
  basic: 'Nivel básico',
  extra: 'Extra opcional',
  none: 'No incluido',
};

function LevelIcon({ level }: { level: Level }) {
  if (level === 'full') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#96DCF6] shadow-[0_2px_10px_rgba(150,220,246,0.6)]">
        <Check className="w-3.5 h-3.5 text-[#05435C]" strokeWidth={3} />
        <span className="sr-only">{LEVEL_LABEL.full}</span>
      </span>
    );
  }
  if (level === 'basic') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#8C96A3] bg-[#C9CED6]/40">
        <Check className="w-3.5 h-3.5 text-[#4A5462]" strokeWidth={2.75} />
        <span className="sr-only">{LEVEL_LABEL.basic}</span>
      </span>
    );
  }
  if (level === 'extra') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#0077D6]/50 bg-[#0077D6]/10">
        <Plus className="w-3.5 h-3.5 text-[#4FA9DE]" strokeWidth={3} />
        <span className="sr-only">{LEVEL_LABEL.extra}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#8C96A3]/50 bg-transparent">
      <X className="w-3.5 h-3.5 text-[#4A5462]" strokeWidth={2.75} />
      <span className="sr-only">{LEVEL_LABEL.none}</span>
    </span>
  );
}

function PkgHeader({ tier, kind, highlighted }: { tier: Tier; kind: Category['kind']; highlighted: boolean }) {
  const isBlue = kind === 'blue';
  return (
    <div
      className={`relative rounded-xl px-3 py-4 h-full flex flex-col items-center justify-center gap-1 text-center transition-all duration-300 ${
        isBlue ? 'glass-blue' : 'glass-silver'
      } ${highlighted ? (isBlue ? 'card-selected-blue' : 'card-selected-silver') : ''}`}
    >
      {tier.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white text-[9px] font-bold tracking-widest uppercase font-sans shadow-[0_4px_14px_rgba(0,119,214,0.35)]">
          <span className="text-[#96DCF6]" aria-hidden>★ </span>{tier.badge}
        </span>
      )}
      <span
        className={`font-serif uppercase tracking-wider text-sm md:text-base leading-tight ${
          isBlue ? 'text-[#4FA9DE]' : 'text-[#4A5462]'
        }`}
      >
        {tier.name}
      </span>
      {tier.note && (
        <span className="text-[10px] text-muted-foreground font-sans italic">{tier.note}</span>
      )}
      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-sans">
        <Clock className="w-3 h-3 text-[#96DCF6]" />
        {tier.duration}
      </span>
    </div>
  );
}

export default function TarifasSection({
  highlighted,
  category,
}: {
  highlighted: string | null;
  /** Categoría activa desde las pestañas de paquetes. */
  category?: CategoryId | null;
}) {
  /* Categoría a mostrar: la del paquete resaltado, la de la pestaña, o la primera */
  const fromPkg = CATEGORIES.find((c) => c.tiers.some((t) => t.id === highlighted));
  const cat = fromPkg ?? CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
  const activeId = (fromPkg && (highlighted as TierId)) || null;
  const isBlue = cat.kind === 'blue';

  const colTint = (tier: Tier) =>
    activeId === tier.id ? (isBlue ? 'bg-[#0077D6]/[0.06]' : 'bg-[#8C96A3]/10') : '';

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
          Qué incluye exactamente cada nivel de {cat.label}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-4 sm:p-6 lg:p-8 overflow-x-auto"
      >
        <table className="w-full min-w-[520px] border-separate border-spacing-x-2 border-spacing-y-0">
          <caption className="sr-only">
            Servicios incluidos en cada nivel: nivel completo, nivel básico, extra opcional o no incluido
          </caption>
          <thead>
            <tr>
              <th scope="col" className="sr-only">
                Servicio
              </th>
              {cat.tiers.map((tier) => (
                <th key={tier.id} scope="col" className="w-[34%] align-bottom pt-3 pb-2">
                  <PkgHeader tier={tier} kind={cat.kind} highlighted={activeId === tier.id} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cat.serviceGroups.map((group, gi) => (
              <React.Fragment key={group.title ?? gi}>
                {group.title && (
                  <tr>
                    <td colSpan={3} className="pt-8 pb-3">
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
                    {cat.tiers.map((tier, idx) => (
                      <td
                        key={tier.id}
                        className={`text-center align-middle py-3 border-b border-[#C9CED6]/40 transition-colors duration-300 ${colTint(tier)}`}
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
            <LevelIcon level="none" />
            No incluido
          </span>
        </div>
      </motion.div>
    </div>
  );

  /* ---------- Bloque: tarifas por tamaño ---------- */
  const tarifasBlock = (
    <div>
      <div className="text-center mb-10">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-serif uppercase tracking-wider text-foreground"
        >
          Tarifas de {cat.label}
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 overflow-x-auto"
      >
        <table className="w-full min-w-[520px] border-separate border-spacing-2">
          <caption className="sr-only">Precios de cada nivel según el tamaño del vehículo</caption>
          <thead>
            <tr>
              <th scope="col" className="sr-only">
                Tamaño del vehículo
              </th>
              {cat.tiers.map((tier) => (
                <th key={tier.id} scope="col" className="w-[34%] align-bottom pt-3">
                  <PkgHeader tier={tier} kind={cat.kind} highlighted={activeId === tier.id} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cat.sizePrices.map(({ size, prices }) => {
              const Icon = SIZE_ICON[size];
              return (
                <tr key={size}>
                  <th scope="row" className="text-left align-middle py-4 pr-2">
                    <span className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-[#96DCF6]" strokeWidth={1.5} />
                      <span>
                        <span className="block font-serif uppercase tracking-wider text-xl md:text-2xl text-foreground leading-none">
                          {size}
                        </span>
                        <span className="block text-xs md:text-sm tracking-widest uppercase text-muted-foreground font-sans mt-1">
                          {SIZE_INFO[size].desc}
                        </span>
                      </span>
                    </span>
                  </th>
                  {cat.tiers.map((tier, idx) => (
                    <td
                      key={tier.id}
                      className={`text-center align-middle rounded-xl py-5 transition-colors duration-300 ${colTint(tier)}`}
                    >
                      <span className={`text-2xl md:text-3xl font-light ${isBlue ? 'text-[#4FA9DE]' : 'text-[#4A5462]'}`}>
                        {prices[idx]}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Nota de la categoría */}
      {cat.footnote && (
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground font-sans">
          <p className="inline-flex items-center gap-2 text-base md:text-lg text-center">
            {cat.id === 'mantenimiento' ? (
              <Home className="w-4 h-4 text-[#96DCF6] shrink-0" />
            ) : (
              <Armchair className="w-4 h-4 text-[#96DCF6] shrink-0" />
            )}
            {cat.footnote}
          </p>
        </div>
      )}
    </div>
  );

  /* ---------- Bloque: servicios extra (tapicería + motor) ---------- */
  const extrasBlock = (
    <div>
      <div className="text-center mb-10">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-serif uppercase tracking-wider text-foreground"
        >
          Servicios Extra
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-script italic text-2xl md:text-3xl text-[#4FA9DE] mt-3"
        >
          Tapicería &middot; Asientos
        </motion.p>
      </div>

      {/* Tapicería */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-4 sm:p-6 lg:p-8 overflow-x-auto"
      >
        <table className="w-full min-w-[480px] border-separate border-spacing-2">
          <caption className="sr-only">Tarifas de tapicería y asientos</caption>
          <thead>
            <tr>
              <th scope="col" className="sr-only">Material</th>
              {TAPICERIA_EXTRA.cols.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="text-center text-xs md:text-sm tracking-widest uppercase font-sans font-semibold text-[#4A5462] pb-2"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TAPICERIA_EXTRA.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="text-left align-middle py-2 pr-2">
                  <span className="inline-flex items-center gap-2 font-serif uppercase tracking-wider text-base md:text-lg text-foreground">
                    <Armchair className="w-5 h-5 text-[#96DCF6]" strokeWidth={1.5} />
                    {row.label}
                  </span>
                </th>
                {row.prices.map((price, i) => (
                  <td key={i} className="text-center align-middle rounded-xl py-4 glass-blue">
                    <span className="block text-xl md:text-2xl font-light text-[#4FA9DE]">{price}</span>
                    <span className="block text-[10px] text-muted-foreground font-sans mt-0.5">
                      {i === 0 ? 'por asiento' : i === 1 ? '2 unidades' : 'vehículo completo'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Motor */}
      <motion.h4
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl md:text-2xl font-serif uppercase tracking-wider text-foreground text-center mt-12"
      >
        Motor
      </motion.h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {MOTOR_EXTRA.map((extra, i) => (
          <motion.div
            key={extra.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-blue rounded-2xl p-6 md:p-8 text-center flex flex-col items-center"
          >
            <Sparkles className="w-7 h-7 text-[#96DCF6] mb-3" strokeWidth={1.5} />
            <h4 className="font-serif uppercase tracking-wider text-lg md:text-xl text-[#4FA9DE]">
              {extra.name}
            </h4>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-sans mt-1">
              <Clock className="w-3 h-3 text-[#96DCF6]" />
              {extra.duration}
            </span>
            <p className="text-sm text-muted-foreground font-sans mt-3 mb-4 max-w-sm">{extra.description}</p>
            <span className="text-3xl font-light text-[#4FA9DE] mt-auto">{extra.price}</span>
          </motion.div>
        ))}
      </div>

      <p className="text-base md:text-lg text-muted-foreground italic font-sans text-center mt-8">
        ✦ {TAPICERIA_EXTRA.note}
      </p>
    </div>
  );

  return (
    <section id="tarifas" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {planBlock}
        <div className="mt-20">{tarifasBlock}</div>
        <div className="mt-20">{extrasBlock}</div>

        {/* ---------- CTA ---------- */}
        <div className="text-center mt-14">
          <p className="font-script italic text-xl md:text-2xl text-[#4FA9DE] mb-5">
            ¿Dudas sobre qué paquete elegir? Escríbenos y te asesoramos.
          </p>
          <a
            href={`https://wa.me/${WA_PHONE}`}
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
