import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { Still } from './ui/Still';
import { Hand, Pencil, Tape } from './ui/Pencil';
import { Stretch } from './ui/Stretch';
import { categories, categoryLabel, pad, posterOf, projects, type CategoryId } from '@/content';
import type { OpenFilm } from './Lightbox';

type Filter = 'all' | CategoryId;

/**
 * The shot log: production paperwork as the project index. Rows get swiped
 * with a highlighter; a large slide on the right shows whatever you're over.
 */
export function ShotLog({ onOpen }: { onOpen: OpenFilm }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState(projects[0].slug);
  const previewRef = useRef<HTMLDivElement>(null);
  const available = categories.filter((c) => projects.some((p) => p.category === c.id));
  const list = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const slugs = list.map((p) => p.slug);
  const current = projects.find((p) => p.slug === active) ?? list[0];

  const open = (slug: string, el: HTMLElement | null) => {
    const r = el?.getBoundingClientRect();
    onOpen(slug, slugs, r ? { x: r.left, y: r.top, w: r.width, h: r.height, rotate: 0 } : undefined);
  };

  return (
    <section id="log" aria-labelledby="log-title" className="relative bg-paper px-[4vw] pb-28 pt-24 md:pb-40 md:pt-32">
      <header className="relative mb-12 md:mb-16">
        <p className="label mb-6 text-ink/50">Sheet A — every film on file</p>
        <Stretch as="h2" id="log-title" className="text-[clamp(3.4rem,11.5vw,12rem)]">
          Shot log
        </Stretch>
        <div className="absolute right-0 top-2 hidden -rotate-3 md:block">
          <Hand className="text-[clamp(28px,2.4vw,40px)]">all vertical. all on a phone.</Hand>
          <Pencil shape="underline" className="mt-1 h-3 w-full" delay={0.6} />
        </div>
      </header>

      {/* Filter stickers */}
      <LayoutGroup>
        <div role="toolbar" aria-label="Filter by discipline" className="no-scrollbar -mx-[4vw] mb-6 flex gap-2 overflow-x-auto px-[4vw] pb-2">
          {[{ id: 'all' as Filter, label: 'Everything' }, ...available].map((c) => {
            const on = filter === c.id;
            const n = c.id === 'all' ? projects.length : projects.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id as Filter)}
                aria-pressed={on}
                className={`label relative shrink-0 rounded-full border-[1.5px] px-4 py-2.5 transition-colors ${
                  on ? 'border-cobalt text-paper' : 'border-ink/20 text-ink/70 hover:border-ink'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="log-filter"
                    className="absolute inset-0 rounded-full bg-cobalt"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {c.label} <span className={on ? 'text-tape' : 'text-ink/35'}>{pad(n)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        {/* The log */}
        <div className="lg:col-span-7">
          <div className="label hidden grid-cols-[3.5rem_minmax(0,1fr)_9rem_7rem] gap-4 border-b-2 border-ink pb-3 text-ink/50 md:grid">
            <span>Roll</span>
            <span>Title</span>
            <span>Discipline</span>
            <span className="text-right">Format</span>
          </div>
          <ol>
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.35, delay: i * 0.015 }}
                  className="border-b border-ink/15"
                >
                  <button
                    onMouseEnter={() => setActive(p.slug)}
                    onFocus={() => setActive(p.slug)}
                    onClick={(e) =>
                      open(
                        p.slug,
                        window.matchMedia('(min-width: 1024px)').matches ? previewRef.current : (e.currentTarget.querySelector('[data-thumb]') as HTMLElement),
                      )
                    }
                    data-cursor="play"
                    aria-label={`Play ${p.title} — ${categoryLabel(p.category)}`}
                    className="group relative grid w-full grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 py-3 text-left md:grid-cols-[3.5rem_minmax(0,1fr)_9rem_7rem] md:py-4"
                  >
                    {/* highlighter swipe */}
                    <span
                      aria-hidden
                      className={`absolute inset-y-1 -left-2 -right-2 origin-left bg-tape/70 dark:bg-cobalt/30 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active === p.slug ? 'scale-x-100' : 'scale-x-0'
                      } max-lg:hidden`}
                    />
                    <span className="relative">
                      <span className="label hidden text-ink/50 md:inline">{pad(i + 1)}</span>
                      <span data-thumb className="relative block aspect-[9/16] w-16 overflow-hidden bg-paper-3 md:hidden">
                        <Still src={posterOf(p, 200)} alt="" fallbackLabel=" " />
                      </span>
                    </span>
                    <span className="relative min-w-0">
                      <span className="block truncate text-[clamp(1.25rem,2.3vw,2.25rem)] font-[750] tracking-[-0.03em] [font-stretch:115%]">
                        {p.title}
                      </span>
                      <span className="label mt-1 block text-ink/50 md:hidden">
                        {pad(i + 1)} · {categoryLabel(p.category)}
                      </span>
                    </span>
                    <span className="label relative hidden text-ink/70 md:block">{categoryLabel(p.category)}</span>
                    <span className="label relative hidden text-right text-ink/50 md:block">
                      {p.orientation === 'horizontal' ? '16:9' : '9:16'}
                      {p.year ? ` · ${p.year}` : ''}
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>

        {/* The big slide */}
        <div className="relative hidden lg:col-span-5 lg:block">
          <div className="sticky top-[9vh]">
            <div ref={previewRef} className="relative mx-auto aspect-[9/16] h-[78vh] max-w-full rotate-[1.5deg] bg-mount p-3 frame-shadow-lift">
              <div className="relative h-full w-full overflow-hidden bg-paper-3">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.slug}
                    className="absolute inset-0"
                    initial={{ clipPath: 'inset(0 0 0 100%)' }}
                    animate={{ clipPath: 'inset(0 0 0 0%)' }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Still src={posterOf(current, 900)} alt="" fallbackLabel={current.title} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <Tape className="-top-3 left-6 rotate-[-8deg]" />
              <Tape className="-bottom-3 right-6 rotate-[6deg]" />
            </div>
            <div className="mt-6 flex -rotate-2 items-center justify-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span key={current.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Hand className="text-[34px]">{current.title.toLowerCase()} — click to play</Hand>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
