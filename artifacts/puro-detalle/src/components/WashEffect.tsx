import React from 'react';
import { motion } from 'framer-motion';

/**
 * Efecto "lavado exprés" al seleccionar una tarjeta:
 * 1. una banda de espuma barre la tarjeta como una esponja,
 * 2. brotan burbujas que flotan y estallan,
 * 3. un destello final la deja reluciente.
 * Overlay puramente decorativo (aria-hidden, sin eventos).
 */

type Props = { tint?: 'blue' | 'silver' };

const BUBBLES = [
  { left: '10%', top: '66%', size: 18, delay: 0.08 },
  { left: '20%', top: '38%', size: 10, delay: 0.14 },
  { left: '32%', top: '74%', size: 14, delay: 0.2 },
  { left: '43%', top: '28%', size: 20, delay: 0.26 },
  { left: '54%', top: '58%', size: 9, delay: 0.32 },
  { left: '64%', top: '40%', size: 16, delay: 0.38 },
  { left: '75%', top: '68%', size: 11, delay: 0.44 },
  { left: '85%', top: '33%', size: 15, delay: 0.5 },
];

const SPARKLES = [
  { left: '78%', top: '18%', delay: 0.68, size: 'text-2xl' },
  { left: '14%', top: '62%', delay: 0.8, size: 'text-lg' },
  { left: '52%', top: '38%', delay: 0.74, size: 'text-xl' },
];

export default function WashEffect({ tint = 'blue' }: Props) {
  const bubbleTint =
    tint === 'blue' ? 'rgba(55, 182, 255, 0.35)' : 'rgba(140, 150, 163, 0.35)';
  const bubbleBorder =
    tint === 'blue' ? 'rgba(0, 119, 214, 0.45)' : 'rgba(91, 100, 112, 0.45)';

  return (
    <div
      aria-hidden
      className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10"
    >
      {/* Banda de espuma (esponja) barriendo la tarjeta */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(100deg, transparent 26%, rgba(255,255,255,0.35) 38%, rgba(255,255,255,0.85) 47%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.85) 53%, rgba(255,255,255,0.35) 62%, transparent 74%)',
          backgroundSize: '250% 100%',
          filter: 'blur(1px)',
        }}
        initial={{ backgroundPosition: '115% 0' }}
        animate={{ backgroundPosition: '-15% 0' }}
        transition={{ duration: 0.72, ease: [0.45, 0, 0.35, 1] }}
      />

      {/* Burbujas de jabón: brotan, flotan y estallan */}
      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 28%, ${bubbleTint} 70%, transparent 100%)`,
            boxShadow: `inset 0 0 0 1px ${bubbleBorder}, inset 2px 2px 3px rgba(255,255,255,0.9)`,
          }}
          initial={{ opacity: 0, scale: 0, y: 4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1, 1.15, 0.2],
            y: [4, -4, -10, -14],
          }}
          transition={{ duration: 0.55, delay: b.delay, ease: 'easeOut' }}
        />
      ))}

      {/* Destello final: la tarjeta queda reluciente */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 62% 36%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 32%, transparent 62%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.4, delay: 0.58, ease: 'easeOut' }}
      />
      {SPARKLES.map((s, i) => (
        <motion.span
          key={`sp-${i}`}
          className={`absolute ${s.size} leading-none text-white`}
          style={{
            left: s.left,
            top: s.top,
            textShadow:
              '0 0 6px rgba(255,255,255,0.95), 0 0 14px rgba(55,182,255,0.8)',
          }}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.25, 0], rotate: 25 }}
          transition={{ duration: 0.42, delay: s.delay, ease: 'easeOut' }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}
