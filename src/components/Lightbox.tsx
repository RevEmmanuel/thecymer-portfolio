import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Play } from 'lucide-react';
import { Still } from './ui/Still';
import { Hand, Pencil, Tape } from './ui/Pencil';
import { categoryLabel, pad, posterOf, projects, site, type Project } from '@/content';
import { useMediaQuery } from '@/lib/hooks';

export type FromRect = { x: number; y: number; w: number; h: number; rotate: number };
export type OpenFilm = (slug: string, list: string[], from?: FromRect) => void;

/* Where each slide lands on the table: left/top in % of the table, width in vw, rotation in deg. */
const DESKTOP_SLOTS = [
  { x: 25, y: 7, w: 10, r: -4 },
  { x: 38.5, y: 15, w: 11.5, r: 3 },
  { x: 53, y: 4, w: 9.5, r: -2 },
  { x: 65, y: 17, w: 12, r: 5 },
  { x: 81, y: 5, w: 10, r: -6 },
  { x: 9, y: 47, w: 11, r: 6 },
  { x: 29, y: 52, w: 10, r: -3 },
  { x: 46, y: 47, w: 12, r: 2 },
  { x: 62.5, y: 53, w: 10.5, r: -5 },
  { x: 78, y: 45, w: 11.5, r: 4 },
  { x: 92, y: 27, w: 9, r: -8 },
];
const MOBILE_SLOTS = [
  { x: 3, y: 9, w: 31, r: -5 },
  { x: 35, y: 4, w: 29, r: 4 },
  { x: 66, y: 11, w: 31, r: -3 },
  { x: -3, y: 37, w: 31, r: 6 },
  { x: 31, y: 33, w: 33, r: -2 },
  { x: 67, y: 39, w: 30, r: 5 },
];

/**
 * The opening: thecymer's films laid out on a lit light table.
 * The lights flick on, the slides drop into place, and every frame is a way in.
 */
export function Lightbox({ onOpen, onReel, onBook }: { onOpen: OpenFilm; onReel: () => void; onBook: () => void }) {
  const reduce = !!useReducedMotion();
  const desktop = useMediaQuery('(min-width: 768px)', true);
  const tableRef = useRef<HTMLDivElement>(null);
  const slots = desktop ? DESKTOP_SLOTS : MOBILE_SLOTS;
  const onTable = useMemo(
    () => projects.slice(0, Math.min(slots.length, desktop ? site.intro.onTable.desktop : site.intro.onTable.mobile)),
    [slots.length, desktop],
  );
  const list = projects.map((p) => p.slug);
  const [top, setTop] = useState<string | null>(null);

  // As you leave the table, the wordmark slides and the slides drift apart slightly.
  const { scrollYProgress } = useScroll({ target: tableRef, offset: ['start start', 'end start'] });
  const markX = useTransform(scrollYProgress, (v) => `${reduce ? 0 : v * -18}%`);

  return (
    <section
      id="table"
      aria-label="The light table — thecymer's films"
      className="relative overflow-hidden"
      data-lights={reduce ? undefined : 'on'}
    >
      <div ref={tableRef} className="lightbox relative h-[100svh] min-h-[640px] w-full overflow-hidden md:min-h-[700px]">
        {/* Slides */}
        {onTable.map((p, i) => (
          <Slide
            key={p.slug}
            project={p}
            index={i}
            slot={slots[i]}
            draggable={desktop && !reduce}
            reduce={reduce}
            constraints={tableRef}
            onTop={top === p.slug}
            onLift={() => setTop(p.slug)}
            onOpen={(from) => onOpen(p.slug, list, from)}
          />
        ))}

        {/* Wordmark, overprinted in grease-pencil blue */}
        <motion.h1
          className="pointer-events-none absolute inset-x-[3vw] top-[30%] z-30 text-cobalt mix-blend-multiply dark:mix-blend-screen md:top-[33%]"
          style={{ x: markX }}
          initial={reduce ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 1.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="sr-only">
            {site.brand.name} — {site.brand.role}
          </span>
          <span className="wordmark block w-full" aria-hidden />
        </motion.h1>

        {/* Handwritten intro */}
        <div className="absolute left-[4vw] top-[64%] z-40 max-w-[16rem] -rotate-2 md:left-[3.5vw] md:top-[10%] md:max-w-[20vw]">
          <Hand animateNow delay={reduce ? 0 : 1.6} className="text-[34px] md:text-[clamp(30px,2.6vw,44px)]">
            {site.intro.note}
          </Hand>
          <br />
          <Hand animateNow delay={reduce ? 0 : 2} className="text-[26px] text-ink md:text-[clamp(24px,1.9vw,32px)]">
            {site.intro.noteTwo}
          </Hand>
        </div>
        <div className="absolute left-[3.5vw] top-[26%] z-40 hidden -rotate-3 items-end gap-1 md:flex">
          <Hand animateNow delay={reduce ? 0 : 2.5} className="text-[clamp(28px,2.2vw,38px)]">
            {site.intro.pickNote}
          </Hand>
          <Pencil shape="arrow" animateNow delay={reduce ? 0 : 2.8} className="mb-4 h-7 w-14 -rotate-[24deg]" />
        </div>

        {/* Caption + actions */}
        <motion.div
          className="absolute inset-x-[4vw] bottom-[max(5.5rem,env(safe-area-inset-bottom))] z-40 flex flex-col gap-4 md:bottom-8 md:flex-row md:items-end md:justify-between"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 1.9, duration: 0.8 }}
        >
          <p className="label hidden max-w-xs leading-relaxed text-ink/60 md:block">
            {site.brand.role}
            <br />
            {site.brand.location} · {pad(projects.length)} films on file
          </p>
          <div className="flex gap-2">
            <button
              onClick={onReel}
              data-cursor="play"
              className="label group relative flex flex-1 items-center justify-center gap-3 bg-ink px-5 py-4 text-paper transition-colors hover:bg-cobalt md:flex-none"
            >
              <Play size={12} className="fill-current" />
              Play the reel
            </button>
            <button
              onClick={onBook}
              className="label relative flex flex-1 items-center justify-center bg-tape px-5 py-4 text-coal transition-transform hover:-rotate-2 md:flex-none"
            >
              Book a shoot
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Slide({
  project,
  index,
  slot,
  draggable,
  reduce,
  constraints,
  onTop,
  onLift,
  onOpen,
}: {
  project: Project;
  index: number;
  slot: { x: number; y: number; w: number; r: number };
  draggable: boolean;
  reduce: boolean;
  constraints: React.RefObject<HTMLDivElement | null>;
  onTop: boolean;
  onLift: () => void;
  onOpen: (from: FromRect) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const [hover, setHover] = useState(false);

  const open = () => {
    if (dragged.current) return;
    const r = ref.current?.getBoundingClientRect();
    onOpen(r ? { x: r.left, y: r.top, w: r.width, h: r.height, rotate: slot.r } : { x: 0, y: 0, w: 0, h: 0, rotate: 0 });
  };

  return (
    <motion.div
      className="absolute"
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}vw`, zIndex: onTop ? 25 : hover ? 24 : 10 + index }}
      drag={draggable}
      dragConstraints={constraints}
      dragElastic={0.15}
      dragMomentum={false}
      onDragStart={() => {
        dragged.current = true;
        onLift();
      }}
      onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
      onPointerDown={onLift}
      initial={reduce ? false : { opacity: 0, y: -90, scale: 1.35, rotate: slot.r * 3 - 12 }}
      animate={{ opacity: 1, y: 0, scale: hover ? 1.04 : 1, rotate: hover ? slot.r * 0.4 : slot.r }}
      transition={{
        opacity: { delay: reduce ? 0 : 0.55 + index * 0.07, duration: 0.25 },
        y: { delay: reduce ? 0 : 0.55 + index * 0.07, type: 'spring', stiffness: 260, damping: 18 },
        scale: { delay: hover ? 0 : reduce ? 0 : 0.55 + index * 0.07, type: 'spring', stiffness: 260, damping: 20 },
        rotate: { type: 'spring', stiffness: 200, damping: 16, delay: hover ? 0 : reduce ? 0 : 0.55 + index * 0.07 },
      }}
    >
      <button
        ref={ref}
        onClick={open}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        data-cursor={draggable ? 'play / drag' : 'play'}
        aria-label={`Play ${project.title} — ${categoryLabel(project.category)}`}
        className={`block w-full touch-manipulation bg-mount p-[5%] pb-0 transition-shadow duration-300 ${
          hover ? 'frame-shadow-lift' : 'frame-shadow'
        }`}
      >
        <span className="relative block aspect-[9/16] overflow-hidden bg-paper-3">
          <Still src={posterOf(project, 520)} alt="" loading="eager" fallbackLabel={project.title} draggable={false} />
        </span>
        <span className="label flex items-center justify-between py-[6%] text-[clamp(7px,0.6vw,10px)] text-ink/70">
          <span>{pad(index + 1)}</span>
          <span className="truncate pl-2">{categoryLabel(project.category)}</span>
        </span>
      </button>
      {index % 4 === 1 && <Tape className="-top-3 left-1/2 w-[55%] -translate-x-1/2 rotate-[-4deg]" />}
    </motion.div>
  );
}
