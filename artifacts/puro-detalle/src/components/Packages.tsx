import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Info } from 'lucide-react';
import WashEffect from './WashEffect';
import CustomBuilder from './CustomBuilder';
import { CATEGORIES, WA_PHONE, type CategoryId } from '../data/services';

/** Pestañas de la sección: las tres categorías + el cotizador a medida. */
export type ServiceTabId = CategoryId | 'personalizado';

const WASH_DURATION_MS = 1150;

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -90, opacity: 0 }),
};

const ORDER: ServiceTabId[] = ['completo', 'interior', 'mantenimiento', 'personalizado'];

export default function Packages({
  activeTab,
  onMoreInfo,
  activeInfo,
  onTabChange,
}: {
  /** Pestaña activa (estado único en Home): categoría o cotizador. */
  activeTab: ServiceTabId;
  onMoreInfo: (id: string, cat: CategoryId) => void;
  /** Paquete cuya info está resaltada en #tarifas: su botón "Más información" se ilumina. */
  activeInfo: string | null;
  /** Al cambiar de pestaña, filtra tarifas y plan de servicios por categoría. */
  onTabChange?: (tab: ServiceTabId) => void;
}) {
  const [direction, setDirection] = React.useState(1);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [washing, setWashing] = React.useState<string | null>(null);
  const washTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(
    () => () => {
      if (washTimer.current) clearTimeout(washTimer.current);
    },
    []
  );

  const switchTab = (tab: ServiceTabId) => {
    if (tab !== activeTab) {
      setDirection(ORDER.indexOf(tab) > ORDER.indexOf(activeTab) ? 1 : -1);
    }
    onTabChange?.(tab);
  };

  const toggleSelect = (name: string) => {
    const willSelect = selected !== name;
    setSelected(willSelect ? name : null);
    if (washTimer.current) clearTimeout(washTimer.current);
    if (willSelect && !prefersReducedMotion) {
      setWashing(name);
      washTimer.current = setTimeout(() => setWashing(null), WASH_DURATION_MS);
    } else {
      setWashing(null);
    }
  };

  const tabRefs = {
    completo: React.useRef<HTMLButtonElement>(null),
    interior: React.useRef<HTMLButtonElement>(null),
    mantenimiento: React.useRef<HTMLButtonElement>(null),
    personalizado: React.useRef<HTMLButtonElement>(null),
  };

  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = ORDER.indexOf(activeTab);
    let next: ServiceTabId | undefined;
    if (e.key === 'ArrowRight') next = ORDER[(idx + 1) % ORDER.length];
    else if (e.key === 'ArrowLeft') next = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
    else if (e.key === 'Home') next = ORDER[0];
    else if (e.key === 'End') next = ORDER[ORDER.length - 1];
    if (!next) return;
    e.preventDefault();
    if (next !== activeTab) switchTab(next);
    tabRefs[next].current?.focus();
  };

  /** Enlace de WhatsApp con mensaje pre-rellenado según el paquete elegido. */
  const waReserveLink = (pkgName: string) =>
    `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
      `Buen día, me interesa reservar el servicio de ${pkgName} para mi coche. Deseo recibir más información.`
    )}`;

  const isBuilder = activeTab === 'personalizado';
  const category = CATEGORIES.find((c) => c.id === activeTab) ?? CATEGORIES[0];
  const isBlue = category.kind === 'blue';

  const onInfoClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onMoreInfo(id, category.id);
  };

  return (
    <section id="servicios" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif text-foreground inline-block uppercase tracking-wider"
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-script italic text-2xl md:text-3xl text-[#4FA9DE] mt-3"
          >
            Lo que tu coche necesita
          </motion.p>
        </div>

        {/* Pestañas de categoría */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-14"
        >
          <div
            role="tablist"
            aria-label="Categorías de servicio"
            onKeyDown={onTablistKeyDown}
            className="glass rounded-full p-1.5 inline-flex gap-1 max-w-full overflow-x-auto"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                ref={tabRefs[cat.id]}
                id={`tab-${cat.id}`}
                role="tab"
                aria-selected={activeTab === cat.id}
                aria-controls={`panel-${cat.id}`}
                tabIndex={activeTab === cat.id ? 0 : -1}
                onClick={() => switchTab(cat.id)}
                className={`px-4 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase font-sans whitespace-nowrap transition-all duration-300 ${
                  activeTab === cat.id
                    ? cat.kind === 'blue'
                      ? 'bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white shadow-[0_4px_20px_rgba(0,119,214,0.35)]'
                      : 'bg-gradient-to-r from-[#C9CED6] to-[#E8ECF1] text-[#15181D] shadow-[0_4px_20px_rgba(140,150,163,0.45)]'
                    : cat.kind === 'blue'
                      ? 'text-[#0077D6] hover:bg-[#0077D6]/5'
                      : 'text-[#5B6470] hover:bg-[#C9CED6]/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <button
              ref={tabRefs.personalizado}
              id="tab-personalizado"
              role="tab"
              aria-selected={isBuilder}
              aria-controls="panel-personalizado"
              tabIndex={isBuilder ? 0 : -1}
              onClick={() => switchTab('personalizado')}
              className={`px-4 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase font-sans whitespace-nowrap transition-all duration-300 ${
                isBuilder
                  ? 'bg-gradient-to-r from-[#062A44] to-[#0B4E7A] text-[#4FC3FF] shadow-[0_4px_20px_rgba(6,42,68,0.5)]'
                  : 'text-[#0077D6] hover:bg-[#0077D6]/5'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="text-[#4FC3FF]">✦</span>
                Crea tu servicio
              </span>
            </button>
          </div>
        </motion.div>

        {/* Tarjetas de la categoría activa */}
        <div className="relative overflow-hidden px-4 -mx-4 py-5 -my-5">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={isBuilder ? 'personalizado' : category.id}
              id={isBuilder ? 'panel-personalizado' : `panel-${category.id}`}
              role="tabpanel"
              aria-labelledby={isBuilder ? 'tab-personalizado' : `tab-${category.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            >
              {isBuilder ? (
                <div className="max-w-6xl mx-auto">
                  <CustomBuilder embedded />
                </div>
              ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {category.tiers.map((pkg) => {
                  const isSelected = selected === pkg.name;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => toggleSelect(pkg.name)}
                      className={`relative rounded-2xl p-8 lg:p-10 flex flex-col cursor-pointer transition-all duration-300 ${
                        isBlue
                          ? `glass-blue hover:border-[#0077D6]/35 hover:shadow-[0_12px_45px_rgba(0,119,214,0.12)] ${isSelected ? 'card-selected-blue' : ''}`
                          : `glass-silver hover:border-[#8C96A3]/60 hover:shadow-[0_12px_45px_rgba(90,100,112,0.16)] ${isSelected ? 'card-selected-silver' : ''}`
                      }`}
                    >
                      {pkg.badge && (
                        <div className="absolute top-4 right-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white text-[10px] font-bold tracking-widest uppercase font-sans shadow-[0_4px_14px_rgba(0,119,214,0.35)]">
                          <span className="text-[#96DCF6]" aria-hidden>★</span> {pkg.badge}
                        </div>
                      )}

                      <h4 className={`text-2xl font-serif mb-2 uppercase tracking-wider ${isBlue ? 'text-[#4FA9DE]' : 'text-[#3A424D]'}`}>
                        {pkg.name}
                      </h4>
                      <div className="text-muted-foreground text-sm mb-2 flex items-baseline gap-2 font-sans">
                        <span>Desde</span>
                        <span className={`text-4xl font-light ${isBlue ? 'text-[#4FA9DE]' : 'text-[#3A424D]'}`}>
                          {pkg.fromPrice}
                        </span>
                      </div>
                      {pkg.note && (
                        <p className="text-xs text-muted-foreground italic mb-6 font-sans">({pkg.note})</p>
                      )}

                      <div className={`h-[1px] w-full mb-8 ${isBlue ? 'bg-[#0077D6]/10' : 'bg-[#8C96A3]/25'}`}></div>

                      <div className="mb-10 flex-1">
                        <p className={`text-[15px] md:text-base leading-relaxed font-serif tracking-wide ${isBlue ? 'text-[#2E7FB8]' : 'text-[#3A424D]'}`}>
                          {pkg.description}
                        </p>
                        <p className={`font-script italic text-xl md:text-2xl mt-5 ${isBlue ? 'text-[#2E7FB8]' : 'text-[#3A424D]'}`}>
                          {pkg.tagline}
                        </p>
                      </div>

                      <a
                        href="#tarifas"
                        aria-label={`Ver tarifas y servicios incluidos de ${pkg.name}`}
                        onClick={(e) => onInfoClick(e, pkg.id)}
                        className={`w-full inline-flex items-center justify-center gap-2 text-center py-3 rounded-full mb-3 transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans border ${
                          isBlue
                            ? `focus-visible:outline-2 focus-visible:outline-[#0077D6]/60 focus-visible:outline-offset-2 ${
                                activeInfo === pkg.id
                                  ? 'border-solid border-[#0077D6] bg-[#0077D6]/10 text-[#4FA9DE] shadow-[0_0_0_3px_rgba(0,119,214,0.16),0_6px_22px_rgba(0,119,214,0.30)]'
                                  : 'border-[#0077D6]/30 text-[#0077D6] hover:border-[#0077D6] hover:bg-[#0077D6]/5'
                              }`
                            : `focus-visible:outline-2 focus-visible:outline-[#5B6470]/60 focus-visible:outline-offset-2 ${
                                activeInfo === pkg.id
                                  ? 'border-solid border-[#5B6470] bg-[#C9CED6]/30 text-[#31383F] shadow-[0_0_0_3px_rgba(140,150,163,0.25),0_6px_22px_rgba(90,100,112,0.28)]'
                                  : 'border-[#8C96A3]/50 text-[#4A5462] hover:border-[#5B6470] hover:bg-[#C9CED6]/15'
                              }`
                        }`}
                      >
                        <Info className="w-4 h-4 text-[#96DCF6]" />
                        Más información
                      </a>

                      <a
                        href={waReserveLink(pkg.name)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full text-center py-3 rounded-full transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans border ${
                          isBlue
                            ? 'border-[#0077D6]/30 text-[#0077D6] hover:border-[#0077D6] hover:bg-[#0077D6]/5'
                            : 'border-[#8C96A3]/50 text-[#4A5462] hover:border-[#5B6470] hover:bg-[#C9CED6]/15'
                        }`}
                      >
                        Reservar
                      </a>

                      {washing === pkg.name && <WashEffect tint={isBlue ? 'blue' : 'silver'} />}
                    </div>
                  );
                })}
              </div>

              {category.footnote && (
                <p className="text-base md:text-lg text-muted-foreground italic font-sans text-center mt-10">
                  {category.footnote}
                </p>
              )}
              </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {!isBuilder && (
          <div className="mt-12 text-center">
            <p className="text-base md:text-lg text-muted-foreground italic font-sans">
              Los precios varían según el tamaño del vehículo: S &middot; M &middot; L &middot; XL. Consulta sin compromiso
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
