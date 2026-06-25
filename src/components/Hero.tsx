import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--bg)]">
      
      {/* Animated Ambient Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-transparent blur-[120px] opacity-40 animate-[blob_10s_infinite] mix-blend-screen" />
        <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-[var(--color-secondary)] to-transparent blur-[100px] opacity-30 animate-[blob_15s_infinite_reverse] mix-blend-screen animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[50vw] h-[45vw] rounded-full bg-gradient-to-tr from-[var(--color-tertiary)] to-transparent blur-[140px] opacity-30 animate-[blob_12s_infinite] mix-blend-screen animation-delay-4000" />
      </div>

      {/* Background Image Overlay with Grain/Darken */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[var(--bg)]/80 sm:bg-[var(--bg)]/60 z-10 backdrop-blur-[2px]" />
        <img 
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&h=1080&auto=format&fit=crop" 
          alt="Cinematic background" 
          className="w-full h-full object-cover scale-105 opacity-60 mix-blend-overlay"
        />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20 text-[var(--fg)]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-sans text-sm md:text-base uppercase tracking-[0.3em] mb-4 opacity-70">
            Mobile Videographer
          </p>
        </motion.div>
        
        <h1 className="font-display font-bold text-6xl md:text-8xl lg:text-[10rem] tracking-tighter leading-[0.85] mb-8 flex flex-col items-center">
          <div className="overflow-hidden p-2 -m-2">
            <motion.span 
              className="block drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
              initial={{ y: "150%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              CAPTURING
            </motion.span>
          </div>
          <div className="overflow-hidden p-4 -m-4">
            <motion.span 
              className="block text-gradient animate-[gradient-shift-complex_2s_ease-in-out_infinite] bg-[length:400%_400%]"
              initial={{ y: "100%", opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              MOTION.
            </motion.span>
          </div>
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
        >
          <button 
            onClick={() => onNavigate('work')} 
            className="group relative overflow-hidden flex items-center justify-center gap-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-animated animate-[gradient-shift_4s_linear_infinite] z-0" />
            <div className="relative z-10 flex items-center gap-3 px-8 py-4 w-full h-full">
              <Play size={18} className="fill-current" />
              <span>View Showreel</span>
            </div>
          </button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-[var(--fg)] opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-16 bg-current mx-auto overflow-hidden opacity-30">
          <div className="w-full h-1/2 bg-[var(--fg)] origin-top animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
