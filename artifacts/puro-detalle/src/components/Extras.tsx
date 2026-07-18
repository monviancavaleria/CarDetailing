import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Disc, Armchair, Droplet, Zap, Wind, Key } from 'lucide-react';

const extras = [
  { icon: Disc, name: "Descontaminación férrica de llantas" },
  { icon: Shield, name: "Sellado cerámico exprés (SiO₂)" },
  { icon: Droplet, name: "Acondicionado de plásticos y neumáticos" },
  { icon: Key, name: "Limpieza técnica de consola y botoneras" },
  { icon: Sparkles, name: "Protección y acondicionado de salpicadero" },
  { icon: Armchair, name: "Limpieza de tapicería (inyección/extracción)" },
  { icon: Wind, name: "Desinfección térmica (vapor)" },
  { icon: Zap, name: "Tratamiento premium de cuero" }
];

export default function Extras() {
  return (
    <section id="extras" className="py-24 bg-[#0b0d10] border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif text-white inline-block relative mb-6 uppercase tracking-wider"
          >
            Extras a la Carta
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-primary"></div>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mt-8 font-sans font-light"
          >
            Personaliza tu servicio con tratamientos profesionales de primer nivel diseñados para restaurar y proteger cada detalle de tu vehículo.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {extras.map((extra, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-4 p-5 glass border-l-2 border-l-primary/20 hover:border-l-primary hover:bg-primary/[0.07] hover:shadow-[0_0_20px_rgba(55,182,255,0.08)] transition-all duration-300"
            >
              <div className="shrink-0 p-2 rounded-full bg-background group-hover:bg-primary/10 transition-colors duration-300">
                <extra.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300 stroke-[1.5]" />
              </div>
              <span className="text-sm text-white/80 group-hover:text-white transition-colors font-sans font-medium">
                {extra.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
