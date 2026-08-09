import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { CUSTOM_SERVICES, WA_PHONE, type CustomService } from '../data/services';

/**
 * Cotizador de servicio personalizado (#personalizado).
 * Coche estilo "plano técnico" en líneas cian sobre panel oscuro
 * (misma estética que las infografías). Pestañas EXTERIOR / INTERIOR,
 * toggles por servicio y barra fija con precio y tiempo estimados.
 * Los importes salen de CUSTOM_SERVICES (src/data/services.ts) y son
 * provisionales: se cambian allí, en un solo sitio.
 */

type Zone = 'exterior' | 'interior';

const CYAN = '#4FC3FF';
const DIM = '#274B66';

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m.toString().padStart(2, '0')} min`;
}

/* ---------------- Coche wireframe (vista lateral, deportivo) ---------------- */

function WireframeCar({ zone }: { zone: Zone }) {
  const ext = zone === 'exterior';
  const bodyStroke = ext ? CYAN : DIM;
  const bodyGlow = ext ? 'drop-shadow(0 0 6px rgba(79,195,255,0.55))' : 'none';
  const intStroke = ext ? DIM : CYAN;
  const intGlow = ext ? 'none' : 'drop-shadow(0 0 6px rgba(79,195,255,0.55))';

  return (
    <svg
      viewBox="0 0 640 270"
      role="img"
      aria-label={`Plano técnico del coche, ${ext ? 'exterior' : 'interior'} resaltado`}
      className="w-full h-auto select-none"
    >
      {/* Suelo */}
      <line x1="16" y1="242" x2="624" y2="242" stroke={DIM} strokeWidth="1" strokeDasharray="2 8" />

      {/* ---------- Carrocería ---------- */}
      <g
        fill="none"
        stroke={bodyStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: bodyGlow, transition: 'stroke 0.5s' }}
      >
        {/* Silueta */}
        <path d="M 28 186 L 26 172 Q 26 158 44 154 L 98 146 Q 152 138 198 134 L 258 96 Q 270 87 286 85 L 372 83 Q 392 83 408 93 L 470 130 Q 522 138 566 148 Q 596 155 598 170 L 596 184 L 552 190 A 46 46 0 0 0 460 192 L 218 192 A 46 46 0 0 0 126 190 L 28 186 Z" />
        {/* Faro delantero y piloto trasero */}
        <path d="M 34 160 L 74 154 L 70 166 L 36 170 Z" strokeWidth="1.6" />
        <path d="M 596 162 L 570 156 L 572 168 L 594 172 Z" strokeWidth="1.6" />
        {/* Línea de carácter lateral */}
        <path d="M 90 168 Q 300 158 560 168" strokeWidth="1.4" opacity="0.75" />
        {/* Falda lateral */}
        <path d="M 226 200 L 452 200" strokeWidth="1.6" />
        {/* Retrovisor */}
        <path d="M 262 104 L 250 98 L 246 106 L 258 112 Z" strokeWidth="1.6" />
        {/* Puerta y tirador */}
        <path d="M 300 132 L 296 190" strokeWidth="1.4" opacity="0.85" />
        <path d="M 312 142 L 336 141" strokeWidth="2.4" />
        {/* Cristales laterales */}
        <path d="M 270 100 L 292 92 L 368 90 L 398 100 L 438 128 L 302 130 Z" strokeWidth="1.6" opacity="0.9" />
        <path d="M 344 90 L 346 129" strokeWidth="1.2" opacity="0.7" />
        {/* Ruedas */}
        <circle cx="172" cy="194" r="42" />
        <circle cx="172" cy="194" r="24" strokeWidth="1.6" />
        <circle cx="506" cy="194" r="42" />
        <circle cx="506" cy="194" r="24" strokeWidth="1.6" />
        {/* Radios */}
        <g strokeWidth="1.2" opacity="0.85">
          <path d="M 172 172 L 172 216 M 150 194 L 194 194 M 157 179 L 187 209 M 187 179 L 157 209" />
          <path d="M 506 172 L 506 216 M 484 194 L 528 194 M 491 179 L 521 209 M 521 179 L 491 209" />
        </g>
      </g>

      {/* ---------- Interior (vista seccionada) ---------- */}
      <g
        fill="none"
        stroke={intStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: intGlow, transition: 'stroke 0.5s' }}
      >
        {/* Salpicadero */}
        <path d="M 268 118 Q 282 122 286 138 L 288 160" />
        {/* Volante */}
        <circle cx="304" cy="134" r="9" strokeWidth="1.6" />
        <path d="M 304 125 L 304 143 M 295 134 L 313 134" strokeWidth="1" opacity="0.8" />
        {/* Asiento delantero: reposacabezas, respaldo y base */}
        <path d="M 352 106 q 9 -3 10 6 q 1 8 -8 9" strokeWidth="1.6" />
        <path d="M 354 122 Q 348 148 352 164 L 384 166 Q 390 166 392 172" />
        {/* Asiento trasero */}
        <path d="M 414 112 q 9 -3 10 6 q 1 8 -8 9" strokeWidth="1.6" />
        <path d="M 416 128 Q 410 150 414 164 L 444 168 Q 452 170 452 176" />
        {/* Suelo del habitáculo */}
        <path d="M 288 176 L 452 178" strokeWidth="1.4" strokeDasharray="5 5" opacity="0.9" />
      </g>
    </svg>
  );
}

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
  const totalPrice = chosen.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const totalMinutes = chosen.reduce((sum, s) => sum + (s.minutes ?? 0), 0);
  const hasPending = chosen.some((s) => s.price === null);

  const waLink = () => {
    const lines = chosen.map((s) => `• ${s.label}${s.price !== null ? ` (${s.price} €)` : ''}`);
    const msg =
      `Buen día, me gustaría cotizar este servicio personalizado:\n\n${lines.join('\n')}\n\n` +
      `Precio estimado: ${totalPrice} €${hasPending ? ' + servicios a confirmar' : ''}\n` +
      `Tiempo estimado: ${formatMinutes(totalMinutes)}\n\n¿Me confirmáis presupuesto y disponibilidad?`;
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
                <WireframeCar zone={zone} />
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
                </div>
                <div className="hidden sm:block w-px h-10 bg-[#1D3247]" />
                <div>
                  <span className="block text-[10px] tracking-[0.2em] uppercase font-sans text-[#5F7A93]">
                    Tiempo estimado
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-lg md:text-xl font-light text-white">
                    <Clock className="w-4 h-4 text-[#96DCF6]" />
                    {totalMinutes > 0 ? `≈ ${formatMinutes(totalMinutes)}` : '—'}
                  </span>
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
