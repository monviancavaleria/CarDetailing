import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden w-full">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-car.jpg"
          alt="Luxury black sports car hood"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-10" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight md:leading-[1.1] mb-6">
            El cuidado que tu coche se merece, <br className="hidden md:block" />
            <span className="text-primary italic">sin moverte de casa.</span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light mx-auto mb-10 max-w-[60ch] leading-relaxed">
            En Puro Detalle ofrecemos un servicio exclusivo y de alta calidad, mediante el uso de los mejores productos del mercado para garantizar un acabo perfecto.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <a
              href="https://wa.me/34603533624"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground overflow-hidden transition-transform active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative font-medium tracking-widest uppercase text-sm">
                Reservar por WhatsApp
              </span>
            </a>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-light tracking-wide">
              <span className="w-8 h-[1px] bg-primary/50"></span>
              <p>Desde 35€ &middot; A domicilio &middot; Madrid</p>
              <span className="w-8 h-[1px] bg-primary/50"></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Descubrir</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            animate={{ 
              y: [0, 48, 48],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-full h-1/2 bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
