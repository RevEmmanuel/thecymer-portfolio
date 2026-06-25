import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';

interface AboutProps {
  onNavigate?: (sectionId: string) => void;
}

const SLIDESHOW_IDS = ["1", "2", "3", "4", "5"];
const slideshowThumbnails = SLIDESHOW_IDS.map(
  id => projects.find(p => p.id === id)!
).filter(Boolean);

export function About({ onNavigate }: AboutProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % slideshowThumbnails.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const currentProject = slideshowThumbnails[slideIndex];

  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-gradient-to-b from-[var(--bg)] to-[var(--surface)] relative overflow-hidden">

      {/* Background flare */}
      <div className="absolute top-1/2 -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-secondary)] opacity-[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 relative"
        >
          {/* Neon back glow behind image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-tertiary)] rounded-3xl blur-2xl opacity-40 translate-x-4 translate-y-4" />

          <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/5">
            <AnimatePresence mode="wait">
              <motion.img
                key={slideIndex}
                src={currentProject.thumbnail}
                alt={currentProject.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-[mix-blend-mode] duration-700"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {slideshowThumbnails.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === slideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
          }}
          className="w-full md:w-1/2 flex flex-col justify-center gap-8"
        >
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="flex flex-col gap-6"
          >
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="font-display font-medium text-4xl md:text-5xl lg:text-7xl mb-2"
            >
              Hi, I'm <span className="text-gradient font-bold leading-tight">thecymer</span>.
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }}
              className="text-xl md:text-2xl text-[var(--fg)] opacity-80 font-light leading-relaxed"
            >
                I am a <span className="text-[var(--color-primary)] font-medium">mobile videographer</span> and <span className="text-[var(--color-secondary)] font-medium">storyteller</span> based wherever the story takes me.
              I specialize in <span className="text-[var(--color-primary)] font-medium">content videos</span>, <span className="text-[var(--color-secondary)] font-medium">shoots</span>, <span className="text-[var(--color-secondary)] font-medium">brand or fashion videography</span>, and <span className="text-[var(--color-tertiary)] font-medium">event coverage</span>.
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }}
              className="text-base text-[var(--fg)] opacity-60 leading-relaxed max-w-lg mb-2"
            >
              My approach to videography is deeply rooted in capturing raw emotion, authentic moments, and striking compositions. Whether working with global brands or individuals, I strive to create visually stunning narratives that leave a lasting impact.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              <button
                onClick={() => onNavigate && onNavigate('contact')}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-animated animate-[gradient-shift_4s_linear_infinite] z-0" />
                <div className="relative z-10 flex items-center gap-3 px-8 py-4 w-full h-full">
                  <span>Contact Me</span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            className="pt-8 border-t border-[var(--border)] grid grid-cols-2 gap-8 mt-2"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "backOut" } } }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="font-bold text-4xl md:text-5xl font-display mb-2 text-gradient">50+</p>
              <p className="text-sm uppercase tracking-wide opacity-60 font-medium">Projects Delivered</p>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "backOut" } } }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="font-bold text-4xl md:text-5xl font-display mb-2 text-gradient" style={{ animationDelay: '1s' }}>2+</p>
              <p className="text-sm uppercase tracking-wide opacity-60 font-medium">Years Experience</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
