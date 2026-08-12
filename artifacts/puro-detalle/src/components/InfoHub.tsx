import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sparkles,
  Shield,
  Disc,
  Armchair,
  Droplet,
  Zap,
  Wind,
  Key,
  Star,
  Users,
  Phone,
  ListPlus,
} from 'lucide-react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import ServiceMap from './ServiceMap';
import ReviewsPanel from './ReviewsPanel';

const extras = [
  { icon: Disc, name: 'Descontaminación férrica de llantas' },
  { icon: Shield, name: 'Sellado cerámico exprés (SiO₂)' },
  { icon: Droplet, name: 'Acondicionado de plásticos y neumáticos' },
  { icon: Key, name: 'Limpieza técnica de consola y botoneras' },
  { icon: Sparkles, name: 'Protección y acondicionado de salpicadero' },
  { icon: Armchair, name: 'Limpieza de tapicería (inyección/extracción)' },
  { icon: Wind, name: 'Desinfección térmica (vapor)' },
  { icon: Zap, name: 'Tratamiento premium de cuero' },
];

type TabId = 'mapa' | 'extras' | 'reviews' | 'conocenos';

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'mapa', label: 'Mapa de nuestro servicio', icon: MapPin },
  { id: 'extras', label: 'Extras a la carta', icon: ListPlus },
  { id: 'reviews', label: 'Nuestras reviews', icon: Star },
  { id: 'conocenos', label: 'Conócenos', icon: Users },
];

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function InfoHub() {
  const [activeTab, setActiveTab] = React.useState<TabId>('mapa');
  const btnRefs = React.useRef<Record<TabId, HTMLButtonElement | null>>({
    mapa: null,
    extras: null,
    reviews: null,
    conocenos: null,
  });

  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const order = tabs.map((t) => t.id);
    const idx = order.indexOf(activeTab);
    let next: TabId | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = order[(idx + 1) % order.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = order[(idx - 1 + order.length) % order.length];
    else if (e.key === 'Home') next = order[0];
    else if (e.key === 'End') next = order[order.length - 1];
    if (!next) return;
    e.preventDefault();
    setActiveTab(next);
    btnRefs.current[next]?.focus();
  };

  return (
    <section id="extras" className="pt-4 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Menú 2x2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          role="tablist"
          aria-label="Información de Puro Detalle"
          onKeyDown={onTablistKeyDown}
          className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mb-12"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  btnRefs.current[tab.id] = el;
                }}
                id={`infotab-${tab.id}`}
                role="tab"
                aria-selected={active}
                aria-controls={`infopanel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-8 md:py-10 transition-all duration-300 ${
                  active
                    ? 'glass-blue border-[#0077D6]/50 shadow-[0_10px_40px_rgba(0,119,214,0.22)]'
                    : 'glass-outlined hover:bg-white/80 hover:shadow-[0_10px_35px_rgba(0,119,214,0.14)]'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#0077D6] to-[#37B6FF] shadow-[0_6px_20px_rgba(0,119,214,0.35)] transition-transform duration-300 group-hover:scale-105 ${
                    active ? 'scale-105' : ''
                  }`}
                >
                  <tab.icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.75} />
                </span>
                <span className="text-sm md:text-base font-semibold tracking-wide uppercase font-sans text-outline text-center leading-snug">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Área de visualización compartida */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            {activeTab === 'mapa' && (
              <motion.div
                key="mapa"
                id="infopanel-mapa"
                role="tabpanel"
                aria-labelledby="infotab-mapa"
                {...fade}
                transition={{ duration: 0.35 }}
              >
                <div className="glass-blue border-[#0077D6]/30 shadow-[0_10px_40px_rgba(0,119,214,0.14)] rounded-2xl max-w-4xl mx-auto p-6 md:p-10 flex flex-col items-center text-center">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#0077D6] to-[#37B6FF] shadow-[0_6px_20px_rgba(0,119,214,0.35)] mb-4">
                    <MapPin className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-2xl font-serif uppercase tracking-wider text-foreground mb-3">
                    Área de actuación: Madrid
                  </h3>
                  <p className="text-muted-foreground font-sans font-light text-sm md:text-base max-w-2xl mb-6">
                    Llegamos hasta 50 km a la redonda. En las zonas azules el transporte está incluido;
                    fuera de ellas, con suplemento.
                  </p>
                  <ServiceMap />
                </div>
              </motion.div>
            )}

            {activeTab === 'extras' && (
              <motion.div
                key="extras"
                id="infopanel-extras"
                role="tabpanel"
                aria-labelledby="infotab-extras"
                {...fade}
                transition={{ duration: 0.35 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {extras.map((extra, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-4 p-5 glass-outlined rounded-xl hover:bg-white/80 hover:shadow-[0_10px_35px_rgba(0,119,214,0.12)] transition-all duration-300"
                    >
                      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0077D6] to-[#37B6FF] shadow-[0_4px_14px_rgba(0,119,214,0.30)] transition-transform duration-300 group-hover:scale-105">
                        <extra.icon className="w-5 h-5 text-white stroke-[1.5]" />
                      </div>
                      <span className="text-sm text-foreground group-hover:text-foreground transition-colors font-sans font-medium">
                        {extra.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                id="infopanel-reviews"
                role="tabpanel"
                aria-labelledby="infotab-reviews"
                {...fade}
                transition={{ duration: 0.35 }}
              >
                <ReviewsPanel />
              </motion.div>
            )}

            {activeTab === 'conocenos' && (
              <motion.div
                key="conocenos"
                id="infopanel-conocenos"
                role="tabpanel"
                aria-labelledby="infotab-conocenos"
                {...fade}
                transition={{ duration: 0.35 }}
              >
                <div className="glass-outlined rounded-2xl max-w-4xl mx-auto p-8 md:p-14 min-h-[280px] flex flex-col justify-center">
                  <p className="text-center text-muted-foreground font-sans font-light mb-10">
                    Llámanos o síguenos en redes — reserva tu cita o consulta sin compromiso.
                  </p>
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-8">
                    <a
                      href="tel:+34603533624"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass-blue text-foreground hover:shadow-[0_8px_35px_rgba(0,119,214,0.18)] transition-all group"
                    >
                      <Phone className="w-7 h-7 text-[#96DCF6] group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-medium tracking-wide">603 533 624</span>
                    </a>
                    <a
                      href="https://tiktok.com/@purodetallecar"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass-outlined text-foreground hover:bg-white/80 hover:shadow-[0_8px_35px_rgba(15,30,50,0.12)] transition-all group"
                    >
                      <FaTiktok className="w-7 h-7 text-[#96DCF6] group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-medium tracking-wide">@purodetallecar</span>
                    </a>
                    <a
                      href="https://instagram.com/PuroDetallecar"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass-outlined text-foreground hover:bg-[#E1306C]/10 hover:shadow-[0_8px_35px_rgba(225,48,108,0.15)] transition-all group"
                    >
                      <FaInstagram className="w-7 h-7 text-[#E1306C] group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-medium tracking-wide">@PuroDetallecar</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
