import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useMediaQuery } from '@/lib/hooks';

/**
 * The editor's loupe. A small ring that follows a mouse and opens into a
 * magnifier with a handwritten label over anything marked `data-cursor`.
 */
export function Loupe() {
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });
  const [label, setLabel] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('has-loupe');
    let lx = -1;
    let ly = -1;
    const read = (t: HTMLElement | null) => {
      setLabel(t?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null);
      setInteractive(!!t?.closest('a, button, [role="button"], label, input, textarea, select'));
      setOnDark(!!t?.closest('[data-tone="dark"]'));
    };
    const refresh = () => lx >= 0 && read(document.elementFromPoint(lx, ly) as HTMLElement | null);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      lx = e.clientX;
      ly = e.clientY;
      x.set(lx);
      y.set(ly);
      setVisible(true);
      read(e.target as HTMLElement);
    };
    const press = () => setDown(true);
    const release = () => {
      setDown(false);
      setTimeout(refresh, 80);
      setTimeout(refresh, 800);
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('keyup', release);
    html.addEventListener('pointerleave', leave);
    return () => {
      html.classList.remove('has-loupe');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('keyup', release);
      html.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = label ? 96 : interactive ? 40 : 18;
  const tone = onDark ? 'border-snow' : 'border-ink';

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x: reduce ? x : sx, y: reduce ? y : sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] ${tone} ${
          label ? 'bg-snow/10 backdrop-blur-[1px]' : ''
        }`}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        {/* crosshair */}
        {!label && !interactive && (
          <>
            <span className={`absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 ${onDark ? 'bg-snow' : 'bg-ink'}`} />
            <span className={`absolute left-1/2 top-1/2 h-1.5 w-px -translate-x-1/2 -translate-y-1/2 ${onDark ? 'bg-snow' : 'bg-ink'}`} />
          </>
        )}
        {/* loupe handle */}
        {label && <span className={`absolute -bottom-3 -right-3 h-6 w-[3px] origin-top -rotate-45 rounded-full ${onDark ? 'bg-snow' : 'bg-ink'}`} />}
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="hand absolute inset-0 flex items-center justify-center text-[26px] text-cobalt"
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
