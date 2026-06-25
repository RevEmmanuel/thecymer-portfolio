import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function PageTransitionOverlay({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[var(--bg)] pointer-events-none flex items-center justify-center overflow-hidden"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Subtle gradient behind text to make it pop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)] opacity-20 animate-[gradient-shift_4s_ease_infinite]" />
          
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative z-10 text-[var(--fg)] font-display font-bold text-4xl md:text-6xl lowercase tracking-tighter"
          >
            thecymer
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
