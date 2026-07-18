import React from 'react';

export default function Footer() {
  return (
    <footer id="contacto" className="pt-12 pb-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0077D6]/30 to-transparent mb-8"></div>

        <p className="text-xs text-muted-foreground tracking-widest uppercase font-sans">
          © {new Date().getFullYear()} Puro Detalle &middot; Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
