import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(11, 13, 16, 0)', 'rgba(11, 13, 16, 0.65)']
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(40px) saturate(180%)']
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
      style={{ backgroundColor, backdropFilter }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex items-end gap-1.5 leading-none">
              <span className="font-script text-3xl text-primary leading-none">Puro</span>
              <span className="font-serif text-xl tracking-[0.2em] text-white uppercase leading-none mb-0.5">Detalle</span>
            </div>
            <div className="h-[1px] w-full bg-primary/60 mt-1"></div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {['servicios', 'extras', 'contacto'].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-sm tracking-widest text-muted-foreground hover:text-white transition-colors uppercase font-sans"
                >
                  {id}
                </button>
              ))}
              <a
                href="https://wa.me/34603533624"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 glass border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-wider text-sm font-medium"
              >
                Reservar ahora
              </a>
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary transition-colors"
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
          className="md:hidden glass border-b border-primary/10"
        >
          <div className="px-2 pt-2 pb-6 flex flex-col space-y-4 sm:px-3 items-center">
            {['servicios', 'extras', 'contacto'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm tracking-widest text-muted-foreground hover:text-white transition-colors uppercase py-2"
              >
                {id}
              </button>
            ))}
            <a
              href="https://wa.me/34603533624"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-6 py-3 bg-primary text-primary-foreground transition-all duration-300 tracking-wider text-sm font-medium mt-4"
            >
              Reservar ahora
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
