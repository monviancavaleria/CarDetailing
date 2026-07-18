import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const categoryA = [
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

const categoryB = [
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

export default function Packages() {
  return (
    <section id="servicios" className="py-24 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif text-white inline-block relative uppercase tracking-wider"
          >
            Nuestros Servicios
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-primary"></div>
          </motion.h2>
        </div>

        {/* Category A — PLATA / Mantenimiento */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="px-3 py-1 text-xs font-semibold tracking-widest text-[#C9CED6] bg-[#C9CED6]/10 border border-[#C9CED6]/20 rounded-full font-sans">
              CATEGORÍA A
            </span>
            <h3 className="text-xl font-serif text-white uppercase tracking-wider">Mantenimiento</h3>
            <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
          </motion.div>
          <p className="text-sm text-muted-foreground mb-8 italic font-sans">
            Servicio a domicilio, mínimo 2 vehículos por desplazamiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoryA.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-silver p-8 lg:p-10 flex flex-col hover:border-[#C9CED6]/30 hover:shadow-[0_0_40px_rgba(201,206,214,0.06)] transition-all duration-500"
              >
                <h4 className="text-2xl font-serif text-white mb-2 uppercase tracking-wider">{pkg.name}</h4>
                <div className="text-muted-foreground text-sm mb-6 flex items-baseline gap-2 font-sans">
                  <span>Desde</span>
                  <span className="text-3xl text-[#C9CED6] font-light">{pkg.price}</span>
                </div>

                <div className="h-[1px] w-full bg-white/5 mb-8"></div>

                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#C9CED6] shrink-0 opacity-80" />
                      <span className="text-sm text-muted-foreground font-sans">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/34603533624"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center border border-[#C9CED6]/20 text-[#C9CED6] hover:border-[#C9CED6]/60 hover:bg-[#C9CED6]/10 py-3 transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans"
                >
                  Reservar
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category B — AZUL ELÉCTRICO / Detallado */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="px-3 py-1 text-xs font-semibold tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full font-sans">
              CATEGORÍA B
            </span>
            <h3 className="text-xl font-serif text-white uppercase tracking-wider">Detallado</h3>
            <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoryB.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 lg:p-10 flex flex-col transition-all duration-500 ${
                  pkg.popular
                    ? 'glass-popular hover:shadow-[0_0_80px_rgba(55,182,255,0.2)]'
                    : 'glass hover:border-primary/30 hover:shadow-[0_0_40px_rgba(55,182,255,0.08)]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase font-sans">
                    ⭐ Más Popular
                  </div>
                )}

                <h4 className="text-2xl font-serif text-white mb-2 uppercase tracking-wider">{pkg.name}</h4>
                <div className="text-muted-foreground text-sm mb-2 flex items-baseline gap-2 font-sans">
                  <span>Desde</span>
                  <span className="text-4xl text-primary font-light">{pkg.price}</span>
                </div>
                <p className="text-xs text-muted-foreground/60 italic mb-6 font-sans">{pkg.note}</p>

                <div className="h-[1px] w-full bg-primary/10 mb-8"></div>

                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 opacity-80" />
                      <span className="text-sm text-muted-foreground font-sans">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/34603533624"
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full text-center py-3 transition-all duration-300 text-sm tracking-widest uppercase font-medium font-sans ${
                    pkg.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(55,182,255,0.4)]'
                      : 'border border-primary/30 text-primary hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  Reservar
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground/80 italic font-sans">
              * Los precios varían según el tamaño del vehículo: S/M &middot; L &middot; XL. Consulta sin compromiso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
