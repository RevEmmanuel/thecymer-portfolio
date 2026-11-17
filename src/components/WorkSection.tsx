import React, { useState, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Project, projects, getThumbnail } from '../data/projects';
import { Play } from 'lucide-react';

interface WorkSectionProps {
  onOpenVideo: (project: Project) => void;
}

const CATEGORIES = ['All', 'Fashion Shoots', 'Events', 'BTS', 'Birthday Shoots', 'Content Videos'] as const;
type Category = typeof CATEGORIES[number];

export function WorkSection({ onOpenVideo }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const shuffledProjects = useMemo(() => {
    const arr = [...projects];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const visible = activeCategory === 'All'
    ? shuffledProjects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Subtle ambient glow behind grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-tertiary)] opacity-5 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10"
      >
        <div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">Selected Work</h2>
          <p className="text-[var(--fg)] opacity-70 max-w-xl text-lg">
            A collection of visual stories capturing the essence of brands, people, and places.
          </p>
        </div>
      </motion.div>

      {/* Category filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 mb-12 overflow-x-auto pb-2"
      >
        <div className="flex gap-3 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-5 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors duration-300 focus:outline-none"
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-[var(--color-primary)] shadow-[0_0_20px_rgba(255,78,0,0.5)]"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${activeCategory === cat ? 'text-white' : 'text-[var(--fg)] opacity-60 hover:opacity-100'}`}>
                {cat}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
        >
          {visible.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => onOpenVideo(project)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/5] sm:aspect-video md:aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--surface)] mb-4 border-2 border-transparent transition-colors duration-500 group-hover:border-[var(--color-primary)]">
        <motion.img
          src={getThumbnail(project)}
          referrerPolicy="no-referrer"
          alt={project.title}
          style={{ x: parallaxX, y: parallaxY }}
          animate={{ scale: isHovered ? 1.15 : 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          loading="lazy"
          className="w-full h-full object-cover origin-center"
        />

        {/* Colorful Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-tertiary)]/70 via-[var(--color-secondary)]/30 to-[var(--color-primary)]/50 flex flex-col items-center justify-center p-6 mix-blend-multiply"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
               <div className="w-20 h-20 rounded-full bg-white backdrop-blur-md flex items-center justify-center text-[var(--color-primary)] shadow-[0_0_40px_rgba(255,78,0,0.8)]">
                <Play size={32} className="fill-current ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 z-10 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:translate-x-1">
          <span className="px-3 py-1 bg-black/60 shadow-lg group-hover:bg-[var(--color-primary)] group-hover:shadow-[0_0_20px_rgba(255,78,0,0.6)] backdrop-blur-md text-white text-xs uppercase tracking-wider rounded-full transition-all duration-300">
            {project.category}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-xl mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-secondary)] transition-all duration-300">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}
