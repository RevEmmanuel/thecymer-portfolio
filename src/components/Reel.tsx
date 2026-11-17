import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Still } from './ui/Still';
import { VideoPlayer } from './VideoPlayer';
import { categoryLabel, featuredProjects, pad, posterOf, site } from '@/content';

/**
 * The screening. Plays the configured showreel, or — until one is supplied —
 * the featured films back to back as a reel you step through.
 */
export function Reel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} label="The reel" className="bg-[#0d0d0d]">
      <Screening onClose={onClose} />
    </Dialog>
  );
}

function Screening({ onClose }: { onClose: () => void }) {
  const reel = site.showreel.video;
  const films = featuredProjects();
  const [i, setI] = useState(0);
  const film = films[i];
  const vertical = reel ? site.showreel.orientation === 'vertical' : film.orientation !== 'horizontal';

  useEffect(() => {
    if (reel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((n) => (n + 1) % films.length);
      if (e.key === 'ArrowLeft') setI((n) => (n - 1 + films.length) % films.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reel, films.length]);

  return (
    <div data-tone="dark" className="flex h-full flex-col text-snow">
      <header className="flex items-center justify-between gap-4 px-4 py-4 md:px-[3vw] md:py-6">
        <p className="label text-snow/60">
          The reel
          {!reel && (
            <>
              {' '}
              · {pad(i + 1)}/{pad(films.length)} · {film.title}
            </>
          )}
        </p>
        <button
          onClick={onClose}
          data-autofocus
          aria-label="Close reel"
          className="label flex items-center gap-2 bg-snow px-4 py-3 text-coal hover:bg-tape"
        >
          Close <X size={14} />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={reel ? 'reel' : film.slug}
            className={`relative overflow-hidden bg-black ${vertical ? 'aspect-[9/16] h-full max-w-full' : 'aspect-video w-full max-w-6xl'}`}
            initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {reel ? (
              <VideoPlayer source={reel} title={`${site.brand.name} reel`} poster={site.showreel.poster || undefined} />
            ) : (
              <VideoPlayer source={film.video} title={film.title} poster={posterOf(film, 1200)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!reel && (
        <nav aria-label="Reel films" className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-5 md:justify-center">
          {films.map((f, n) => (
            <button
              key={f.slug}
              onClick={() => setI(n)}
              aria-current={n === i}
              aria-label={`${pad(n + 1)} ${f.title}`}
              className={`group relative shrink-0 bg-mount p-1 pb-0 transition-transform ${n === i ? '-translate-y-2 rotate-[-3deg]' : 'opacity-60 hover:opacity-100'}`}
            >
              <span className="relative block aspect-[9/16] w-12 overflow-hidden bg-paper-3 md:w-14">
                <Still src={posterOf(f, 160)} alt="" fallbackLabel=" " />
              </span>
              <span className="label block py-1 text-[8px] text-ink">{categoryLabel(f.category)}</span>
              {n === i && <span className="absolute -bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-tape" />}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
