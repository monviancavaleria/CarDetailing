import React from 'react';
import { motion } from 'framer-motion';

const logoUrl = `${import.meta.env.BASE_URL}logo-hero.webp`;

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden w-full">
      {/* Orbes de cristal líquido */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#8CE8FF]/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-[#37B6FF]/20 blur-[130px]" />
        <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[#C9CED6]/25 blur-[120px]" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-32 pb-20">
        {/* Logotipo oficial (sin fondo ni lema) con barrido de luz sobre la propia silueta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="relative w-[300px] sm:w-[420px] md:w-[520px] max-w-full">
            <img
              src={logoUrl}
              alt="Puro Detalle — Detailing y mantenimiento a domicilio"
              width={1600}
              height={408}
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto drop-shadow-[0_12px_35px_rgba(15,30,50,0.16)]"
            />
            <img
              src={logoUrl}
              alt=""
              aria-hidden
              width={1600}
              height={408}
              decoding="async"
              className="logo-glint absolute inset-0 w-full h-auto"
            />
          </div>
          <div className="mt-6 h-[2px] w-full bg-gradient-to-r from-transparent via-[#0077D6]/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight md:leading-[1.12] mb-6 uppercase tracking-wide">
            <span className="sweep sweep-silver">
              El cuidado que tu coche se merece,
            </span>{' '}
            <br className="hidden md:block" />
            <span className="sweep sweep-blue sweep-delay font-script text-4xl md:text-6xl lg:text-7xl normal-case tracking-normal">
              sin moverte de casa.
            </span>
          </h1>

          <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-light mx-auto mb-10 max-w-[60ch] leading-relaxed">
            En Puro Detalle ofrecemos un servicio exclusivo y de alta calidad hasta la comodidad de tu hogar, mediante el uso de los mejores productos del mercado para garantizar un acabado perfecto.
          </p>

          <div className="flex flex-col items-center gap-5">
            <a
              href="https://wa.me/34603533624"
              target="_blank"
              rel="noreferrer"
              className="btn-bubble group relative inline-flex items-center justify-center px-10 py-4 rounded-full overflow-hidden text-[#075A9E] transition-transform duration-300 active:scale-95 hover:scale-[1.03]"
            >
              <span className="relative font-sans font-semibold tracking-widest uppercase text-sm">
                Reservar por WhatsApp
              </span>
            </a>

            <p className="font-script text-2xl md:text-4xl text-[#0077D6]">
              A un click de tu hogar.
            </p>

            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-light tracking-wide">
              <span className="w-8 h-[1px] bg-[#0077D6]/40"></span>
              <p>Servicio premium a domicilio &middot; Madrid</p>
              <span className="w-8 h-[1px] bg-[#0077D6]/40"></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4 font-sans">Descubrir</span>
        <div className="w-[1px] h-12 bg-foreground/15 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 48, 48], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#0077D6]"
          />
        </div>
      </motion.div>
    </section>
  );
}
