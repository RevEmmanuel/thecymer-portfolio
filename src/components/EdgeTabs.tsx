import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { scrollToId } from '@/lib/hooks';
import { useTheme } from '@/lib/theme';
import { site } from '@/content';

const TABS = [
  { id: 'table', label: 'Table' },
  { id: 'log', label: 'Shot log' },
  { id: 'hello', label: 'Hello' },
  { id: 'bts', label: 'Behind' },
  { id: 'book', label: 'Book' },
];

/**
 * Ring-binder divider tabs. On desktop they stick out of the right edge of
 * the screen; on phones they sit along the bottom like folder tabs.
 */
export function EdgeTabs() {
  const [active, setActive] = useState('table');

  useEffect(() => {
    const els = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Small brand label, top-left */}
      <a
        href="#table"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('table');
        }}
        aria-label={`${site.brand.name} — back to the table`}
        className="fixed left-[4vw] top-4 z-50 bg-paper/90 px-2.5 py-1.5 text-ink backdrop-blur-sm md:top-5"
      >
        <span className="wordmark h-[18px] md:h-[20px]" aria-hidden />
      </a>

      <LightSwitch />

      {/* Desktop: right-edge divider tabs */}
      <nav aria-label="Sections" className="fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-1.5 md:flex">
        {TABS.map((t, i) => {
          const on = active === t.id;
          return (
            <motion.button
              key={t.id}
              onClick={() => scrollToId(t.id)}
              aria-current={on ? 'true' : undefined}
              animate={{ x: on ? 0 : 10 }}
              whileHover={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`label flex w-10 items-center justify-center rounded-l-md py-4 pr-2 shadow-[-2px_2px_6px_rgba(0,0,0,0.12)] [writing-mode:vertical-rl] ${
                on ? 'bg-cobalt text-paper ring-2 ring-paper' : ['bg-paper-3 text-ink', 'bg-tape text-coal', 'bg-mount text-ink'][i % 3]
              }`}
            >
              <span className="rotate-180">{t.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Mobile: bottom folder tabs */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-50 flex items-end gap-1 px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {TABS.map((t, i) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => scrollToId(t.id)}
              aria-current={on ? 'true' : undefined}
              className={`label flex-1 rounded-t-md px-1 text-[9.5px] shadow-[0_-2px_6px_rgba(0,0,0,0.1)] transition-all ${
                on ? 'bg-cobalt py-4 text-paper ring-2 ring-paper' : `py-3 text-ink ${['bg-paper-3 text-ink', 'bg-tape !text-coal', 'bg-mount text-ink'][i % 3]}`
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}

/** The lamp switch: lights on (light mode) / lights off (dark mode). */
function LightSwitch() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      data-cursor={dark ? 'lights on' : 'lights off'}
      className="label fixed right-4 top-4 z-50 flex items-center gap-2.5 bg-paper/90 py-1.5 pl-3 pr-1.5 text-ink backdrop-blur-sm md:right-[4vw] md:top-5"
    >
      <span>{dark ? 'Lights off' : 'Lights on'}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${dark ? 'bg-ink/25' : 'bg-tape'}`}>
        <motion.span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-ink shadow"
          animate={{ left: dark ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </span>
    </button>
  );
}
