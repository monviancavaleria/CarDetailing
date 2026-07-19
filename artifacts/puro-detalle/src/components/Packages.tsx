import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import WashEffect from './WashEffect';

const mantenimiento = [
  {
    name: "Mantenimiento Básico",
    price: "35€",
    features: [
      "Lavado exterior detallado",
      "Limpieza de llantas cara visible",
      "Aspirado básico interior",
      "Limpieza de cristales",
      "Acondicionado de neumáticos"
    ]
  },
  {
    name: "Mantenimiento Profundo",
    price: "55€",
    features: [
      "Todo lo del Básico",
      "Descontaminación férrica exterior",
      "Limpieza profunda de llantas",
      "Aspirado profundo (maletero incl.)",
      "Limpieza de plásticos interiores"
    ]
  }
];

const detallado = [
  {
    name: "Boutique Integral",
    price: "89€",
    popular: false,
    note: "(incluye 1 asiento)",
    features: [
      "Lavado exterior premium",
      "Descontaminación química",
      "Limpieza profunda de motor",
      "Limpieza de tapicería (1 asiento)",
      "Sellador cerámico express"
    ]
  },
  {
    name: "Platinum",
    price: "139€",
    popular: true,
    note: "(incluye todos los asientos)",
    features: [
      "Lavado exterior premium total",
      "Descontaminación química y física",
      "Limpieza de tapicería integral",
      "Nutrición de plásticos/cuero",
      "Protección cerámica 6 meses"
    ]
  }
];

type TabId = 'detallado' | 'mantenimiento';

const WASH_DURATION_MS = 1150;

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -90, opacity: 0 }),
};

export default function Packages() {
  const [activeTab, setActiveTab] = React.useState<TabId>('detallado');
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

  const switchTab = (tab: TabId) => {
    if (tab === activeTab) return;
    setDirection(tab === 'mantenimiento' ? 1 : -1);
    setActiveTab(tab);
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

  const detalladoRef = React.useRef<HTMLButtonElement>(null);
  const mantenimientoRef = React.useRef<HTMLButtonElement>(null);

  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const order: TabId[] = ['detallado', 'mantenimiento'];
    const idx = order.indexOf(activeTab);
    let next: TabId | undefined;
    if (e.key === 'ArrowRight') next = order[(idx + 1) % order.length];
    else if (e.key === 'ArrowLeft') next = order[(idx - 1 + order.length) % order.length];
    else if (e.key === 'Home') next = order[0];
    else if (e.key === 'End') next = order[order.length - 1];
    if (!next) return;
    e.preventDefault();
    if (next !== activeTab) switchTab(next);
    (next === 'detallado' ? detalladoRef : mantenimientoRef).current?.focus();
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
            className="font-script italic text-2xl md:text-3xl text-[#0077D6] mt-3"
          >
            Lo que tu coche te pide
          </motion.p>
        </div>

        {/* Pestañas */}
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
            className="glass rounded-full p-1.5 inline-flex gap-1"
          >
            <button
              ref={detalladoRef}
              id="tab-detallado"
              role="tab"
              aria-selected={activeTab === 'detallado'}
              aria-controls="panel-detallado"
              tabIndex={activeTab === 'detallado' ? 0 : -1}
              onClick={() => switchTab('detallado')}
              className={`px-6 sm:px-10 py-3 rounded-full text-sm font-semibold tracking-widest uppercase font-sans transition-all duration-300 ${
                activeTab === 'detallado'
                  ? 'bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white shadow-[0_4px_20px_rgba(0,119,214,0.35)]'
                  : 'text-[#0077D6] hover:bg-[#0077D6]/5'
              }`}
            >
              Detallado
            </button>
            <button
              ref={mantenimientoRef}
              id="tab-mantenimiento"
              role="tab"
              aria-selected={activeTab === 'mantenimiento'}
              aria-controls="panel-mantenimiento"
              tabIndex={activeTab === 'mantenimiento' ? 0 : -1}
              onClick={() => switchTab('mantenimiento')}
              className={`px-6 sm:px-10 py-3 rounded-full text-sm font-semibold tracking-widest uppercase font-sans transition-all duration-300 ${
                activeTab === 'mantenimiento'
                  ? 'bg-gradient-to-r from-[#C9CED6] to-[#E8ECF1] text-[#15181D] shadow-[0_4px_20px_rgba(140,150,163,0.45)]'
                  : 'text-[#5B6470] hover:bg-[#C9CED6]/15'
              }`}
            >
              Mantenimiento
            </button>
          </div>
        </motion.div>

        {/* Contenido con transición deslizante */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {activeTab === 'detallado' ? (
              <motion.div
                key="detallado"
                id="panel-detallado"
                role="tabpanel"
                aria-labelledby="tab-detallado"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {detallado.map((pkg, i) => {
                    const isSelected = selected === pkg.name;
                    return (
                    <div
                      key={i}
                      onClick={() => toggleSelect(pkg.name)}
                      className={`relative rounded-2xl p-8 lg:p-10 flex flex-col cursor-pointer transition-all duration-300 ${
                        pkg.popular
                          ? 'glass-popular hover:shadow-[0_16px_60px_rgba(0,119,214,0.22)]'
                          : 'glass-blue hover:border-[#0077D6]/35 hover:shadow-[0_12px_45px_rgba(0,119,214,0.12)]'
                      } ${isSelected ? 'card-selected-blue' : ''}`}
                    >
                      {pkg.popular && (
                        <div className="absolute top-4 right-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white text-[10px] font-bold tracking-widest uppercase font-sans shadow-[0_4px_14px_rgba(0,119,214,0.35)]">
                        ⭐ Más Popular
                        </div>
                      )}

                      <h4 className="text-2xl font-serif text-[#075A9E] mb-2 uppercase tracking-wider">{pkg.name}</h4>
                      <div className="text-muted-foreground text-sm mb-2 flex items-baseline gap-2 font-sans">
                        <span>Desde</span>
                        <span className="text-4xl text-[#0077D6] font-light">{pkg.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic mb-6 font-sans">{pkg.note}</p>

                      <div className="h-[1px] w-full bg-[#0077D6]/10 mb-8"></div>

                      <ul className="space-y-4 mb-10 flex-1">
                        {pkg.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#0077D6] shrink-0" />
                            <span className="text-sm font-serif text-[#075A9E] tracking-wide">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(pkg.name);
                        }}
                        className={`w-full inline-flex items-center justify-center gap-2 text-center py-3 rounded-full mb-3 transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans focus-visible:outline-2 focus-visible:outline-[#0077D6]/60 focus-visible:outline-offset-2 ${
                          isSelected
                            ? 'bg-[#0077D6]/10 border border-[#0077D6] text-[#075A9E] font-semibold'
                            : 'border border-dashed border-[#0077D6]/40 text-[#0077D6] hover:border-solid hover:border-[#0077D6]'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                        {isSelected ? 'Seleccionado' : `Seleccionar ${pkg.name}`}
                      </button>

                      <a
                        href="https://wa.me/34603533624"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full text-center py-3 rounded-full transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white hover:brightness-110 shadow-[0_4px_18px_rgba(0,119,214,0.30)]'
                            : 'border border-[#0077D6]/30 text-[#0077D6] hover:border-[#0077D6] hover:bg-[#0077D6]/5'
                        }`}
                      >
                        Reservar
                      </a>

                      {washing === pkg.name && <WashEffect tint="blue" />}
                    </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mantenimiento"
                id="panel-mantenimiento"
                role="tabpanel"
                aria-labelledby="tab-mantenimiento"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {mantenimiento.map((pkg, i) => {
                    const isSelected = selected === pkg.name;
                    return (
                    <div
                      key={i}
                      onClick={() => toggleSelect(pkg.name)}
                      className={`relative glass-silver rounded-2xl p-8 lg:p-10 flex flex-col cursor-pointer hover:border-[#8C96A3]/60 hover:shadow-[0_12px_45px_rgba(90,100,112,0.16)] transition-all duration-300 ${isSelected ? 'card-selected-silver' : ''}`}
                    >
                      <h4 className="text-2xl font-serif text-[#4A5462] mb-2 uppercase tracking-wider">{pkg.name}</h4>
                      <div className="text-muted-foreground text-sm mb-6 flex items-baseline gap-2 font-sans">
                        <span>Desde</span>
                        <span className="text-3xl text-[#4A5462] font-light">{pkg.price}</span>
                      </div>

                      <div className="h-[1px] w-full bg-[#8C96A3]/25 mb-8"></div>

                      <ul className="space-y-4 mb-10 flex-1">
                        {pkg.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#5B6470] shrink-0" />
                            <span className="text-sm font-serif text-[#4A5462] tracking-wide">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(pkg.name);
                        }}
                        className={`w-full inline-flex items-center justify-center gap-2 text-center py-3 rounded-full mb-3 transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans focus-visible:outline-2 focus-visible:outline-[#5B6470]/60 focus-visible:outline-offset-2 ${
                          isSelected
                            ? 'bg-[#5B6470]/10 border border-[#5B6470] text-[#4A5462] font-semibold'
                            : 'border border-dashed border-[#8C96A3]/60 text-[#4A5462] hover:border-solid hover:border-[#5B6470]'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                        {isSelected ? 'Seleccionado' : `Seleccionar ${pkg.name}`}
                      </button>

                      <a
                        href="https://wa.me/34603533624"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full text-center py-3 rounded-full border border-[#8C96A3]/50 text-[#4A5462] hover:border-[#5B6470] hover:bg-[#C9CED6]/15 transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans"
                      >
                        Reservar
                      </a>

                      {washing === pkg.name && <WashEffect tint="silver" />}
                    </div>
                    );
                  })}
                </div>

                {/* Condición del servicio de mantenimiento */}
                <p className="font-script italic text-lg md:text-xl text-[#0077D6] text-center mt-10">
                  Servicio a domicilio mínimo 2 vehículos por servicio de mantenimiento
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic font-sans">
            * Los precios varían según el tamaño del vehículo: S/M &middot; L &middot; XL. Consulta sin compromiso.
          </p>
        </div>
      </div>
    </section>
  );
}
