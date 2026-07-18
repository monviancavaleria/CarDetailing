import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#0b0d10] pt-24 pb-12 border-t border-primary/10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 uppercase tracking-wider">Hablemos</h2>
          <p className="text-muted-foreground font-sans font-light mb-12">
            Reserva tu cita o consulta sin compromiso.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-20">
            <a
              href="https://wa.me/34603533624"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors group"
            >
              <div className="p-3 rounded-full glass group-hover:bg-[#25D366]/20 group-hover:text-[#25D366] group-hover:border-[#25D366]/30 transition-all">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <span className="font-sans font-medium tracking-wide">603 533 624</span>
            </a>

            <a
              href="https://instagram.com/PuroDetallecar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors group"
            >
              <div className="p-3 rounded-full glass group-hover:bg-[#E1306C]/20 group-hover:text-[#E1306C] group-hover:border-[#E1306C]/30 transition-all">
                <FaInstagram className="w-6 h-6" />
              </div>
              <span className="font-sans font-medium tracking-wide">@PuroDetallecar</span>
            </a>

            <a
              href="https://tiktok.com/@purodetallecar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors group"
            >
              <div className="p-3 rounded-full glass group-hover:bg-white/20 group-hover:border-white/30 transition-all">
                <FaTiktok className="w-6 h-6" />
              </div>
              <span className="font-sans font-medium tracking-wide">@purodetallecar</span>
            </a>
          </div>
        </motion.div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-8"></div>

        <p className="text-xs text-muted-foreground/60 tracking-widest uppercase font-sans">
          © {new Date().getFullYear()} Puro Detalle &middot; Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
