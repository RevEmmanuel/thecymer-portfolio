import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Still } from './ui/Still';
import { Hand, Tape } from './ui/Pencil';
import { VideoPlayer } from './VideoPlayer';
import { categoryLabel, pad, posterOf, projectBySlug, type Project } from '@/content';
import { externalUrl } from '@/lib/video';
import { useViewport } from '@/lib/hooks';
import type { FromRect } from './Lightbox';

interface Props {
  slug: string | null;
  list: string[];
  from?: FromRect;
  onClose: () => void;
  onNavigate: (slug: string) => void;
  onBook: () => void;
}

/**
 * The lights go down and the slide you picked is lifted off the table and
 * projected. The frame flies from exactly where you clicked it.
 */
export function FilmView({ slug, list, from, onClose, onNavigate, onBook }: Props) {
  const project = slug ? projectBySlug(slug) : undefined;
  return (
    <Dialog open={!!project} onClose={onClose} label={project ? `${project.title} — film` : 'Film'} variant="fade" className="bg-[#0d0d0d]/95">
      {project && <Room project={project} list={list} from={from} onClose={onClose} onNavigate={onNavigate} onBook={onBook} />}
    </Dialog>
  );
}

function Room({ project, list, from, onClose, onNavigate, onBook }: { project: Project } & Omit<Props, 'slug'>) {
  const reduce = useReducedMotion();
  const vp = useViewport();
  const desktop = vp.w >= 1024;
  const vertical = project.orientation !== 'horizontal';
  const idx = Math.max(0, list.indexOf(project.slug));
  const prev = projectBySlug(list[(idx - 1 + list.length) % list.length]);
  const next = projectBySlug(list[(idx + 1) % list.length]);
  const [landed, setLanded] = useState(!from || !!reduce);
  const [firstSlug] = useState(project.slug);

  // Where the projected frame ends up.
  const target = useMemo(() => {
    const maxH = desktop ? vp.h * 0.86 : vp.h * 0.62;
    const areaW = desktop ? vp.w * 0.56 : vp.w - 32;
    let h: number;
    let w: number;
    if (vertical) {
      h = Math.min(maxH, (areaW * 16) / 9);
      w = (h * 9) / 16;
    } else {
      w = Math.min(areaW, (maxH * 16) / 9);
      h = (w * 9) / 16;
    }
    const x = desktop ? (vp.w * 0.56 - w) / 2 + vp.w * 0.02 : (vp.w - w) / 2;
    const y = desktop ? (vp.h - h) / 2 : 72;
    return { x, y, w, h };
  }, [vp, desktop, vertical]);

  const flying = !!from && !reduce && project.slug === firstSlug;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && next) onNavigate(next.slug);
      if (e.key === 'ArrowLeft' && prev) onNavigate(prev.slug);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onNavigate]);

  return (
    <div data-tone="dark" className="h-full overflow-y-auto lg:overflow-hidden">
      <div className="relative min-h-full lg:h-full" style={desktop ? undefined : { paddingTop: target.y + target.h + 24, paddingBottom: 1 }}>
        {/* Projected frame */}
        <motion.div
          key={project.slug}
          className="absolute z-10 overflow-hidden bg-black"
          initial={
            flying
              ? { left: from!.x, top: from!.y, width: from!.w, height: from!.h, rotate: from!.rotate }
              : { left: target.x, top: target.y + 20, width: target.w, height: target.h, rotate: 0, opacity: 0 }
          }
          animate={{ left: target.x, top: target.y, width: target.w, height: target.h, rotate: 0, opacity: 1 }}
          transition={{ duration: flying ? 0.85 : 0.45, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => setLanded(true)}
        >
          {!landed || (flying && !landed) ? (
            <Still src={posterOf(project, 900)} alt="" loading="eager" fallbackLabel={project.title} />
          ) : (
            <VideoPlayer source={project.video} title={project.title} poster={posterOf(project, 1200)} />
          )}
        </motion.div>

        {/* Projector beam glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: target.x - 80,
            top: target.y - 80,
            width: target.w + 160,
            height: target.h + 160,
            background: 'radial-gradient(closest-side, rgba(34,56,255,0.22), transparent)',
          }}
        />

        {/* Notes card */}
        <motion.aside
          className="relative z-20 mx-4 mb-8 bg-paper p-6 text-ink lg:absolute lg:right-[3vw] lg:top-1/2 lg:mx-0 lg:mb-0 lg:w-[34vw] lg:max-w-[520px] lg:-translate-y-1/2 lg:rotate-[1.2deg] lg:p-9"
          initial={{ opacity: 0, x: desktop ? 60 : 0, y: desktop ? 0 : 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: flying ? 0.45 : 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tape className="-top-3 left-8 rotate-[-5deg]" />
          <AnimatePresence mode="wait">
            <motion.div key={project.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="label flex flex-wrap gap-x-4 gap-y-1 text-ink/50">
                <span>
                  Roll {pad(idx + 1)} / {pad(list.length)}
                </span>
                <span className="text-cobalt">{categoryLabel(project.category)}</span>
                {project.year && <span>{project.year}</span>}
              </p>
              <h2 className="wide mt-4 text-[clamp(2rem,3.6vw,3.6rem)]">{project.title}</h2>
              {project.client && <p className="mt-2 text-ink/70">for {project.client}</p>}
              {project.description ? (
                <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/75">{project.description}</p>
              ) : (
                <Hand animateNow className="mt-5 text-[30px]">
                  {vertical ? 'shot vertical, 9:16 — made for the phone in your hand' : 'shot widescreen, 16:9'}
                </Hand>
              )}
              {project.credits && project.credits.length > 0 && (
                <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                  {project.credits.map((c) => (
                    <div key={c.role + c.name} className="flex justify-between gap-4 py-2.5">
                      <dt className="label text-ink/50">{c.role}</dt>
                      <dd className="text-sm">{c.name}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {project.stills && project.stills.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {project.stills.map((s) => (
                    <div key={s.src} className="relative aspect-[4/5] overflow-hidden bg-paper-3">
                      <Still src={s.src} alt={s.alt} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 flex flex-wrap gap-2">
            <button onClick={onBook} className="label bg-tape px-4 py-3 text-coal transition-transform hover:-rotate-2">
              Book something like this
            </button>
            <a
              href={externalUrl(project.video)}
              target="_blank"
              rel="noopener noreferrer"
              className="label flex items-center gap-2 border-[1.5px] border-ink/25 px-4 py-3 hover:border-ink"
            >
              Open original <ExternalLink size={12} />
            </a>
          </div>

          {list.length > 1 && prev && next && (
            <nav aria-label="More films" className="mt-7 grid grid-cols-2 gap-3 border-t border-ink/15 pt-5">
              {[
                { p: prev, label: 'Previous', Icon: ArrowLeft },
                { p: next, label: 'Next', Icon: ArrowRight },
              ].map(({ p, label, Icon }) => (
                <button
                  key={label}
                  onClick={() => onNavigate(p.slug)}
                  className={`group flex items-center gap-3 ${label === 'Next' ? 'flex-row-reverse text-right' : ''}`}
                >
                  <span className="relative aspect-[9/16] w-9 shrink-0 overflow-hidden bg-paper-3">
                    <Still src={posterOf(p, 160)} alt="" fallbackLabel=" " />
                  </span>
                  <span className="min-w-0">
                    <span className="label flex items-center gap-1 text-ink/45 group-hover:text-cobalt">
                      {label === 'Previous' && <Icon size={11} />} {label} {label === 'Next' && <Icon size={11} />}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold">{p.title}</span>
                  </span>
                </button>
              ))}
            </nav>
          )}
        </motion.aside>

        <button
          onClick={onClose}
          data-autofocus
          aria-label="Close film"
          className="label fixed right-4 top-4 z-30 flex items-center gap-2 bg-snow px-4 py-3 text-coal transition-colors hover:bg-tape lg:right-[3vw] lg:top-6"
        >
          Back to the table <X size={14} />
        </button>
        <p className="label fixed bottom-5 left-[3vw] z-30 hidden text-snow/40 lg:block">← → browse · Esc close</p>
      </div>
    </div>
  );
}
