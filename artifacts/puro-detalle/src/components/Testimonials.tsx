import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Nunca había visto mi M4 reflejar la luz así. El nivel de detalle en el interior es obsesivo, superaron cualquier expectativa. Además, hacerlo en mi garaje es un lujo.",
    author: "Carlos M.",
    car: "BMW M4 Competition"
  },
  {
    quote: "Confié en Puro Detalle para el tratamiento cerámico de mi coche. Profesionalidad absoluta, puntualidad y un resultado de exposición. Totalmente recomendado.",
    author: "Elena R.",
    car: "Porsche Cayenne"
  },
  {
    quote: "Rescataron el cuero claro de mis asientos que daba por perdido. Parecen recién salidos del concesionario. El trato y los productos que usan son de otra liga.",
    author: "Javier T.",
    car: "Mercedes GLE"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-8 md:p-10 border border-white/5 relative flex flex-col"
            >
              <span className="absolute top-6 left-6 text-6xl text-primary/10 font-serif leading-none select-none">
                "
              </span>
              <p className="text-muted-foreground italic font-light text-sm md:text-base leading-relaxed mb-8 relative z-10 pt-4 flex-1">
                {testimonial.quote}
              </p>
              <div className="mt-auto">
                <div className="h-[1px] w-12 bg-primary/30 mb-4"></div>
                <h5 className="text-white font-medium text-sm">{testimonial.author}</h5>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Cliente {testimonial.car}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
