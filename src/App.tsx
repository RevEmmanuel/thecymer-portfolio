import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { WorkSection } from './components/WorkSection';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { CustomCursor } from './components/CustomCursor';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
import { Project } from './data/projects';
import { motion, useScroll, useSpring } from 'motion/react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  const handleNavigate = (id: string) => {
    setIsTransitioning(true);
    
    // After overlay covers screen, jump to section
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        // Adjust for navbar if needed. We scroll directly to element
        const top = id === 'hero' ? 0 : el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'instant' });
      }
      
      // Give DOM time to paint jump, then remove overlay to reveal section
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 600); // Wait for the 0.6s overlay entrance animation
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen">
      <CustomCursor />
      
      <PageTransitionOverlay isVisible={isTransitioning} />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)] origin-left z-50"
        style={{ scaleX }}
      />

      <Navbar isDark={isDark} toggleDark={toggleDark} onNavigate={handleNavigate} />
      
      <main>
        <Hero onNavigate={handleNavigate} />
        <Marquee />
        <WorkSection onOpenVideo={(p) => setSelectedProject(p)} />
        <About onNavigate={handleNavigate} />
      </main>

      <Footer />

      <VideoModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
