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

const testimonials = [
  {
    quote:
      'Nunca había visto mi M4 reflejar la luz así. El nivel de detalle en el interior es obsesivo, superaron cualquier expectativa. Además, hacerlo en mi garaje es un lujo.',
    author: 'Carlos M.',
    car: 'BMW M4 Competition',
  },
  {
    quote:
      'Confié en Puro Detalle para el tratamiento cerámico de mi coche. Profesionalidad absoluta, puntualidad y un resultado de exposición. Totalmente recomendado.',
    author: 'Elena R.',
    car: 'Porsche Cayenne',
  },
  {
    quote:
      'Rescataron el cuero claro de mis asientos que daba por perdido. Parecen recién salidos del concesionario. El trato y los productos que usan son de otra liga.',
    author: 'Javier T.',
    car: 'Mercedes GLE',
  },
];

type TabId = 'mapa' | 'extras' | 'reviews' | 'conocenos';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
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
                className={`group flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-8 md:py-10 transition-all duration-300 ${
                  active
                    ? 'glass-blue border-[#0077D6]/40 shadow-[0_8px_35px_rgba(0,119,214,0.18)]'
                    : 'glass hover:bg-white/75 hover:shadow-[0_10px_35px_rgba(0,119,214,0.10)]'
                }`}
              >
                <tab.icon
                  className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ${
                    active ? 'text-[#37B6FF] icon-glow-blue' : 'text-[#0077D6]/60 group-hover:text-[#0077D6]'
                  }`}
                  strokeWidth={1.75}
                />
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
                <div className="glass-blue rounded-2xl max-w-4xl mx-auto p-10 md:p-16 flex flex-col items-center justify-center text-center min-h-[280px]">
                  <MapPin className="w-12 h-12 text-[#0077D6]/50 mb-5" strokeWidth={1.5} />
                  <h3 className="text-2xl font-serif uppercase tracking-wider text-foreground mb-3">
                    Área de actuación: Madrid
                  </h3>
                  <p className="text-muted-foreground font-sans font-light text-sm md:text-base max-w-md">
                    Muy pronto podrás consultar aquí el mapa interactivo de nuestras zonas de servicio a
                    domicilio en la Comunidad de Madrid.
                  </p>
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
                      className="group flex items-center gap-4 p-5 glass rounded-xl border-l-2 border-l-[#0077D6]/25 hover:border-l-[#0077D6] hover:bg-white/75 hover:shadow-[0_10px_35px_rgba(0,119,214,0.10)] transition-all duration-300"
                    >
                      <div className="shrink-0 p-2 rounded-full bg-[#0077D6]/5 group-hover:bg-[#0077D6]/10 transition-colors duration-300">
                        <extra.icon className="w-5 h-5 text-[#0077D6]/70 group-hover:text-[#0077D6] transition-colors duration-300 stroke-[1.5]" />
                      </div>
                      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors font-sans font-medium">
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
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {testimonials.map((testimonial, i) => (
                    <div
                      key={i}
                      className="glass rounded-2xl p-8 relative flex flex-col flex-1 hover:shadow-[0_12px_45px_rgba(15,30,50,0.10)] transition-shadow duration-500"
                    >
                      <span className="absolute top-6 left-6 text-6xl text-[#0077D6]/10 font-serif leading-none select-none">
                        "
                      </span>
                      <p className="text-muted-foreground italic font-light text-sm leading-relaxed mb-8 relative z-10 pt-4 flex-1">
                        {testimonial.quote}
                      </p>
                      <div className="mt-auto">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-[#0077D6]/50 to-[#D4AF37]/50 mb-4"></div>
                        <h5 className="text-foreground font-medium text-sm">{testimonial.author}</h5>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                          Cliente {testimonial.car}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="glass rounded-2xl max-w-4xl mx-auto p-8 md:p-14 min-h-[280px] flex flex-col justify-center">
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
                      <Phone className="w-7 h-7 text-[#0077D6] group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-medium tracking-wide">603 533 624</span>
                    </a>
                    <a
                      href="https://tiktok.com/@purodetallecar"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass text-foreground hover:bg-white/80 hover:shadow-[0_8px_35px_rgba(15,30,50,0.12)] transition-all group"
                    >
                      <FaTiktok className="w-7 h-7 text-foreground group-hover:scale-110 transition-transform" />
                      <span className="font-sans font-medium tracking-wide">@purodetallecar</span>
                    </a>
                    <a
                      href="https://instagram.com/PuroDetallecar"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass text-foreground hover:bg-[#E1306C]/10 hover:shadow-[0_8px_35px_rgba(225,48,108,0.15)] transition-all group"
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
