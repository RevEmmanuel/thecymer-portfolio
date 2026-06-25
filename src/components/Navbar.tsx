import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Instagram, Mail, Video } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  toggleDark: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ isDark, toggleDark, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? (isDark ? 'bg-[#050505]/80 backdrop-blur-md py-3 shadow-lg' : 'bg-white/80 backdrop-blur-md py-3 shadow-sm') : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <button onClick={() => onNavigate('hero')} className="flex items-center gap-2 group">
          <span className="font-display font-bold text-2xl tracking-tighter lowercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(to_right,var(--color-primary),var(--color-secondary))] transition-colors duration-300">
            thecymer
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <button onClick={() => onNavigate('hero')} className="hover:text-[var(--color-primary)] transition-colors">Home</button>
          <button onClick={() => onNavigate('work')} className="hover:text-[var(--color-primary)] transition-colors">Work</button>
          <button onClick={() => onNavigate('about')} className="hover:text-[var(--color-primary)] transition-colors">About</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-[var(--color-primary)] transition-colors">Contact</button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
