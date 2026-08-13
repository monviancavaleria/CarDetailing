import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, Sparkles } from 'lucide-react';

import HoloCarXray from './HoloCarXray';
import {
  CUSTOM_SERVICES,
  SIZE_SURCHARGE,
  SIZE_INFO,
  WA_PHONE,
  type CustomService,
  type SizeId,
} from '../data/services';

/**
 * Cotizador de servicio personalizado (#personalizado).
 * Coche estilo "plano técnico" en líneas cian sobre panel oscuro
 * (misma estética que las infografías). Pestañas EXTERIOR / INTERIOR,
 * toggles por servicio y barra fija con precio y tiempo estimados.
 * Los importes salen de CUSTOM_SERVICES (src/data/services.ts) y son
 * provisionales: se cambian allí, en un solo sitio.
 */

type Zone = 'exterior' | 'interior';

/* ---------------- Toggle de servicio ---------------- */

function ServiceToggle({
  svc,
  on,
  onToggle,
}: {
  svc: CustomService;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-sans transition-all duration-300 focus-ring-cyan ${
        on
          ? 'border-[#4FC3FF] bg-[#0E2A40] shadow-[0_0_18px_rgba(79,195,255,0.25)]'
          : 'border-[#26394C] bg-[#0B1723]/60 hover:border-[#4FC3FF]/50'
      }`}
    >
      <span
        aria-hidden
        className={`inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-full border transition-all duration-300 ${
          on ? 'bg-[#4FC3FF] border-[#4FC3FF]' : 'border-[#3D5870]'
        }`}
      >
        {on && <Check className="w-4 h-4 text-[#06263C]" strokeWidth={3} />}
      </span>
      <span className={`flex-1 text-sm md:text-base ${on ? 'text-white' : 'text-[#9FB6C9]'}`}>
        {svc.label}
      </span>
      <span className="text-right shrink-0">
        <span className={`block text-sm md:text-base font-medium ${on ? 'text-[#4FC3FF]' : 'text-[#5B7A78]'}`}>
          {svc.price !== null ? `${svc.price} €` : 'a confirmar'}
        </span>
      </span>
    </button>
  );
}

/* ---------------- Sección principal ---------------- */

export default function CustomBuilder({ embedded = false }: { embedded?: boolean }) {
  const [zone, setZone] = React.useState<Zone>('exterior');
  const [size, setSize] = React.useState<SizeId>('S');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const zoneTabRefs: Record<Zone, React.RefObject<HTMLButtonElement | null>> = {
    exterior: React.useRef<HTMLButtonElement>(null),
    interior: React.useRef<HTMLButtonElement>(null),
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const chosen = CUSTOM_SERVICES.filter((s) => selected.has(s.id));
  // Suplemento global por tamaño: solo se aplica si hay algún servicio elegido.
  const surcharge = chosen.length > 0 ? SIZE_SURCHARGE[size] : { price: 0, minutes: 0 };
  const totalPrice = chosen.reduce((sum, s) => sum + (s.price ?? 0), 0) + surcharge.price;
  const hasPending = chosen.some((s) => s.price === null);

  const waLink = () => {
    const lines = chosen.map((s) => `• ${s.label}${s.price !== null ? ` (${s.price} €)` : ''}`);
    if (surcharge.price > 0) {
      lines.push(`• Suplemento por tamaño ${size}: +${surcharge.price} €`);
    }
    const msg =
      `Buen día, me gustaría cotizar este servicio personalizado (vehículo tamaño ${size}):\n\n${lines.join('\n')}\n\n` +
      `Precio estimado: ${totalPrice} €${hasPending ? ' + servicios a confirmar' : ''}\n\n¿Me confirmáis presupuesto y disponibilidad?`;
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  };

  const visible = CUSTOM_SERVICES.filter((s) => s.zone === zone);
  const countIn = (z: Zone) => chosen.filter((s) => s.zone === z).length;

  const body = (
    <>
        {!embedded && (
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif uppercase tracking-wider text-foreground"
            >
              Crea tu servicio a medida
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-script italic text-2xl md:text-3xl text-[#4FA9DE] mt-3"
            >
              Elige solo lo que tu coche necesita
            </motion.p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-[#0A101B] border border-[#1D3247] shadow-[0_20px_60px_rgba(4,20,38,0.5)] overflow-hidden"
        >
          {/* brillo decorativo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full bg-[#0077D6]/20 blur-3xl"
          />

          <div className="relative p-5 sm:p-8 lg:p-10 pb-0">
            {/* Selector de tamaño del vehículo */}
            <div className="flex flex-col items-center gap-2 mb-8">
              <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#5F7A93]">
                Tamaño del vehículo
              </span>
              <div
                role="radiogroup"
                aria-label="Tamaño del vehículo"
                className="inline-flex gap-1 rounded-full border border-[#26394C] bg-[#0B1723] p-1.5"
              >
                {(Object.keys(SIZE_SURCHARGE) as SizeId[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    role="radio"
                    aria-checked={size === sz}
                    title={SIZE_INFO[sz].desc}
                    onClick={() => setSize(sz)}
                    className={`px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase font-sans transition-all duration-300 focus-ring-cyan ${
                      size === sz
                        ? 'bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white shadow-[0_4px_20px_rgba(0,119,214,0.45)]'
                        : 'text-[#7FA3BF] hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <span className="text-xs font-sans text-[#5F7A93]">
                {SIZE_INFO[size].desc}
                {SIZE_SURCHARGE[size].price > 0 && ` · Suplemento: +${SIZE_SURCHARGE[size].price} €`}
              </span>
            </div>

            {/* Pestañas EXTERIOR / INTERIOR */}
            <div className="flex justify-center mb-8">
              <div
                role="tablist"
                aria-label="Zona del vehículo"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const next: Zone = zone === 'exterior' ? 'interior' : 'exterior';
                    setZone(next);
                    zoneTabRefs[next].current?.focus();
                  }
                }}
                className="inline-flex gap-1 rounded-full border border-[#26394C] bg-[#0B1723] p-1.5"
              >
                {(['exterior', 'interior'] as Zone[]).map((z) => (
                  <button
                    key={z}
                    ref={zoneTabRefs[z]}
                    type="button"
                    role="tab"
                    id={`tab-zona-${z}`}
                    aria-selected={zone === z}
                    aria-controls="panel-zona"
                    tabIndex={zone === z ? 0 : -1}
                    onClick={() => setZone(z)}
                    className={`relative px-6 sm:px-10 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase font-sans transition-all duration-300 focus-ring-cyan ${
                      zone === z
                        ? 'bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white shadow-[0_4px_20px_rgba(0,119,214,0.45)]'
                        : 'text-[#7FA3BF] hover:text-white'
                    }`}
                  >
                    {z}
                    {countIn(z) > 0 && (
                      <span
                        className={`absolute -top-1.5 -right-1 min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${
                          zone === z ? 'bg-white text-[#0077D6]' : 'bg-[#4FC3FF] text-[#06263C]'
                        }`}
                      >
                        {countIn(z)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center pb-8">
              {/* Coche */}
              <div>
                <HoloCarXray size={size} selectedServices={selected} zone={zone} />
                <p className="text-center text-[11px] tracking-[0.25em] uppercase font-sans text-[#5F7A93] mt-2">
                  {zone === 'exterior' ? 'Vista exterior' : 'Vista del habitáculo'}
                </p>
              </div>

              {/* Toggles */}
              <div id="panel-zona" role="tabpanel" aria-labelledby={`tab-zona-${zone}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={zone}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2.5"
                  >
                    {visible.map((svc) => (
                      <ServiceToggle
                        key={svc.id}
                        svc={svc}
                        on={selected.has(svc.id)}
                        onToggle={() => toggle(svc.id)}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Barra fija de resumen */}
          <div className="sticky bottom-0 z-20 border-t border-[#1D3247] bg-[#0A101B]/95 backdrop-blur px-5 sm:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 justify-between">
              <div className="flex items-center gap-5 text-center sm:text-left">
                <div>
                  <span className="block text-[10px] tracking-[0.2em] uppercase font-sans text-[#5F7A93]">
                    Precio estimado
                  </span>
                  <span className="text-2xl md:text-3xl font-light text-[#4FC3FF]">
                    {totalPrice} €{hasPending && <span className="text-sm text-[#7FA3BF]"> + pendientes</span>}
                  </span>
                  {surcharge.price > 0 && (
                    <span className="block text-[11px] font-sans text-[#7FA3BF]">
                      Suplemento por tamaño {size}: +{surcharge.price} €
                    </span>
                  )}
                </div>
              </div>

              {chosen.length > 0 ? (
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-medium font-sans transition-all whitespace-nowrap bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white hover:brightness-110 shadow-[0_8px_30px_rgba(0,119,214,0.45)] focus-ring-cyan"
                >
                  <MessageCircle className="w-5 h-5 text-[#96DCF6]" />
                  Cotizar y reservar
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm tracking-widest uppercase font-medium font-sans whitespace-nowrap bg-[#13202E] text-[#4A627C] cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5 text-[#4A627C]" />
                  Cotizar y reservar
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <p className="flex items-center justify-center gap-2 text-sm md:text-base text-muted-foreground italic font-sans text-center mt-6">
          <Sparkles className="w-4 h-4 text-[#96DCF6] shrink-0" />
          Precios y tiempos orientativos: te confirmamos el presupuesto exacto por WhatsApp.
        </p>
    </>
  );

  if (embedded) {
    return <div id="personalizado" className="scroll-mt-24">{body}</div>;
  }

  return (
    <section id="personalizado" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{body}</div>
    </section>
  );
}
