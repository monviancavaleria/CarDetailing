import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Award, MapPin } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: "Personal Certificado",
    description: "Deja tu coche en las mejores manos."
  },
  {
    icon: Sparkles,
    title: "Productos premium",
    description: "Marcas líderes altamente cualificadas."
  },
  {
    icon: Award,
    title: "Resultados garantizados",
    description: "Acabados de exposición en cada servicio."
  },
  {
    icon: MapPin,
    title: "A domicilio",
    description: "Porque tu comodidad es primordial."
  }
];

export default function TrustStrip() {
  return (
    <section className="bg-gradient-to-b from-[#2a2a38] to-[#1e1e2a] border-y border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 p-4 rounded-full bg-background border border-white/5 group-hover:border-primary/50 transition-colors duration-500">
                <benefit.icon className="w-6 h-6 text-primary stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-serif text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
