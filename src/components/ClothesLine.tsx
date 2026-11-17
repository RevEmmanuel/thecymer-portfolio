import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react';
import { Still } from './ui/Still';
import { Hand } from './ui/Pencil';
import { Stretch } from './ui/Stretch';
import { categoryLabel, pad, posterOf, projects, site } from '@/content';
import type { OpenFilm } from './Lightbox';

/**
 * Behind the shot: BTS films pegged to a line strung across the room.
 * They swing with the speed of your scroll.
 */
export function ClothesLine({ onOpen }: { onOpen: OpenFilm }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const bts = projects.filter((p) => p.category === 'bts');
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 14 });
  const swing = useTransform(vel, (v) => (reduce ? 0 : Math.max(-9, Math.min(9, v / 140))));

  if (!bts.length && !site.btsStills.length) return null;
  const slugs = bts.map((p) => p.slug);
  const pegs = bts.length + site.btsStills.length;

  return (
    <section id="bts" ref={ref} aria-labelledby="bts-title" className="relative overflow-hidden bg-paper-2 pb-28 pt-24 md:pb-36 md:pt-32">
      <div className="flex flex-col gap-4 px-[4vw] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-6 text-ink/50">Sheet C — off the clock</p>
          <Stretch as="h2" id="bts-title" className="text-[clamp(2.8rem,8.4vw,8.8rem)]">
            Behind the shot
          </Stretch>
        </div>
        <Hand className="max-w-xs -rotate-2 text-[clamp(30px,2.6vw,40px)]">the bit nobody sees — small kit, quick feet</Hand>
      </div>

      <div className="no-scrollbar relative mt-14 overflow-x-auto md:mt-20 md:overflow-visible">
        <div className="relative mx-auto min-w-[720px] px-[4vw] md:min-w-0" style={{ height: 'clamp(460px, 42vw, 640px)' }}>
          {/* the line */}
          <svg className="absolute inset-x-0 top-6 h-24 w-full text-ink" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d="M -2 2 Q 50 18 102 2"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              vectorEffect="non-scaling-stroke"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>

          <div className="relative flex h-full justify-around">
            {bts.map((p, i) => (
              <Peg key={p.slug} i={i} n={pegs} swing={swing}>
                <button
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    onOpen(p.slug, slugs, { x: r.left, y: r.top, w: r.width, h: r.height, rotate: 0 });
                  }}
                  data-cursor="play"
                  aria-label={`Play ${p.title}`}
                  className="block w-full bg-mount p-[5%] pb-0 frame-shadow transition-shadow hover:frame-shadow-lift"
                >
                  <span className="relative block aspect-[9/16] overflow-hidden bg-paper-3">
                    <Still src={posterOf(p, 500)} alt="" fallbackLabel={p.title} />
                  </span>
                  <span className="label flex justify-between py-2 text-[9px] text-ink/70">
                    <span>BTS {pad(i + 1)}</span>
                    <span>{categoryLabel(p.category)}</span>
                  </span>
                </button>
              </Peg>
            ))}
            {site.btsStills.map((s, i) => (
              <Peg key={s.src} i={bts.length + i} n={pegs} swing={swing}>
                <figure className="relative aspect-[4/5] overflow-hidden bg-mount p-[5%] frame-shadow">
                  <span className="relative block h-full w-full overflow-hidden">
                    <Still src={s.src} alt={s.alt} />
                  </span>
                </figure>
              </Peg>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Peg({ i, n, swing, children }: { i: number; n: number; swing: MotionValue<number>; children: React.ReactNode }) {
  // Follow the sag of the line: lower in the middle.
  const t = n === 1 ? 0.5 : (i + 0.5) / n;
  const sag = 4 * t * (1 - t); // 0..1
  const offset = 36 + sag * 38;
  const dir = i % 2 ? -1 : 1;
  const rotate = useTransform(swing, (v) => v * dir * (0.7 + (i % 3) * 0.2));
  return (
    <motion.div
      className="relative w-[200px] shrink-0 md:w-[19vw] md:max-w-[280px]"
      style={{ marginTop: offset, rotate, transformOrigin: '50% -14px' }}
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.3 + i * 0.12 }}
    >
      {/* wooden peg */}
      <span aria-hidden className="absolute -top-5 left-1/2 z-10 h-9 w-3 -translate-x-1/2 rounded-[2px] bg-[#c9a36b] shadow-[inset_-2px_0_0_rgba(0,0,0,0.15)]" />
      {children}
    </motion.div>
  );
}
