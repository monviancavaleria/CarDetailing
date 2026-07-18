import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const logoUrl = `${import.meta.env.BASE_URL}logo-hero.webp`;

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.72)']
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(24px) saturate(160%)']
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ['0 0 0 rgba(15,30,50,0)', '0 8px 32px rgba(15,30,50,0.06)']
  );

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter, boxShadow }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src={logoUrl}
              alt="Puro Detalle"
              width={1600}
              height={408}
              className="h-11 md:h-12 w-auto"
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {['servicios', 'extras', 'contacto'].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase font-sans"
                >
                  {id}
                </button>
              ))}
              <a
                href="https://wa.me/34603533624"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white hover:brightness-110 transition-all duration-300 tracking-wider text-sm font-medium shadow-[0_4px_18px_rgba(0,119,214,0.30)]"
              >
                Reservar ahora
              </a>
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-[#0077D6] transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-b border-foreground/5"
        >
          <div className="px-2 pt-2 pb-6 flex flex-col space-y-4 sm:px-3 items-center">
            {['servicios', 'extras', 'contacto'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase py-2"
              >
                {id}
              </button>
            ))}
            <a
              href="https://wa.me/34603533624"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-[#0077D6] to-[#37B6FF] text-white transition-all duration-300 tracking-wider text-sm font-medium mt-4"
            >
              Reservar ahora
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
