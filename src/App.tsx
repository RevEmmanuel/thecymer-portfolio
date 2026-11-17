import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Lightbox, type FromRect } from './components/Lightbox';
import { ShotLog } from './components/ShotLog';
import { Hello } from './components/Hello';
import { ClothesLine } from './components/ClothesLine';
import { Notes } from './components/Notes';
import { BookingSheet } from './components/BookingSheet';
import { Footer } from './components/Footer';
import { EdgeTabs } from './components/EdgeTabs';
import { projectBySlug, projects } from './content';
import { scrollToId } from './lib/hooks';

const Loupe = lazy(() => import('./components/Loupe').then((m) => ({ default: m.Loupe })));
const FilmView = lazy(() => import('./components/FilmView').then((m) => ({ default: m.FilmView })));
const Reel = lazy(() => import('./components/Reel').then((m) => ({ default: m.Reel })));
const Terms = lazy(() => import('./components/Terms').then((m) => ({ default: m.Terms })));

const ALL = projects.map((p) => p.slug);
const slugFromHash = () => {
  const m = window.location.hash.match(/^#work\/([\w-]+)$/);
  return m && projectBySlug(m[1]) ? m[1] : null;
};

type Film = { slug: string; list: string[]; from?: FromRect };

export default function App() {
  const [film, setFilm] = useState<Film | null>(() => {
    const s = slugFromHash();
    return s ? { slug: s, list: ALL } : null;
  });
  const [reel, setReel] = useState(false);
  const [terms, setTerms] = useState(false);

  // Films are deep-linkable (#work/<slug>) and close with the browser's back button.
  useEffect(() => {
    const onPop = () => {
      const s = slugFromHash();
      setFilm((f) => (s ? { slug: s, list: f?.list ?? ALL } : null));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openFilm = useCallback((slug: string, list: string[], from?: FromRect) => {
    setFilm({ slug, list, from });
    history.pushState({ tcFilm: true }, '', `#work/${slug}`);
  }, []);
  const navigate = useCallback((slug: string) => {
    setFilm((f) => (f ? { ...f, slug } : f));
    history.replaceState(history.state, '', `#work/${slug}`);
  }, []);
  const closeFilm = useCallback(() => {
    setFilm(null);
    if (history.state?.tcFilm) history.back();
    else history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);
  const book = useCallback(() => {
    if (film) {
      closeFilm();
      setTimeout(() => scrollToId('book'), 450);
    } else scrollToId('book');
  }, [film, closeFilm]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#log" className="label fixed left-4 top-4 z-[400] -translate-y-24 bg-cobalt px-4 py-3 text-paper focus:translate-y-0">
        Skip to the films
      </a>
      <Suspense fallback={null}>
        <Loupe />
      </Suspense>
      <EdgeTabs />

      <main>
        <Lightbox onOpen={openFilm} onReel={() => setReel(true)} onBook={book} />
        <ShotLog onOpen={openFilm} />
        <Hello />
        <ClothesLine onOpen={openFilm} />
        <Notes />
        <BookingSheet onTerms={() => setTerms(true)} />
      </main>
      <Footer onTerms={() => setTerms(true)} />

      <Suspense fallback={null}>
        <FilmView slug={film?.slug ?? null} list={film?.list ?? ALL} from={film?.from} onClose={closeFilm} onNavigate={navigate} onBook={book} />
        <Reel open={reel} onClose={() => setReel(false)} />
        <Terms open={terms} onClose={() => setTerms(false)} />
      </Suspense>
    </MotionConfig>
  );
}
