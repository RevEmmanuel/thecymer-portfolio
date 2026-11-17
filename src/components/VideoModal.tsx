import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Project, getThumbnail } from '../data/projects';

interface VideoModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ project, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setIsLoading(true); // Reset loading state when opening
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
          onClick={onClose}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
          >
            <X size={24} />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, clipPath: 'inset(10%)' }}
            animate={{ scale: 1, opacity: 1, clipPath: 'inset(0%)' }}
            exit={{ scale: 0.8, opacity: 0, clipPath: 'inset(50%)' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <Loader2 size={48} className="text-[var(--color-primary)] animate-spin opacity-80" />
              </div>
            )}

            {project.videoUrl.includes('drive.google.com') ? (
              <iframe
                src={project.videoUrl}
                className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                allow="autoplay"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            ) : (
              <video
                ref={videoRef}
                src={project.videoUrl}
                poster={getThumbnail(project)}
                className={`w-full h-full object-contain transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                controls
                autoPlay
                controlsList="nodownload"
                onLoadedData={() => setIsLoading(false)}
                onCanPlay={() => setIsLoading(false)}
              />
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.2, delay: 0 } }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-white pointer-events-none"
          >
            <h2 className="font-display font-bold text-2xl md:text-4xl mb-2">{project.title}</h2>
            <p className="text-white/60 uppercase tracking-widest text-sm md:text-base">{project.client}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
