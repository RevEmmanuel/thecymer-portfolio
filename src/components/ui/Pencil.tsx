import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Grease-pencil marks. Each one draws itself on when it scrolls into view,
 * the way an editor marks up frames on a light table.
 */

const SHAPES = {
  circle:
    'M 52 6 C 20 4 3 18 4 32 C 5 48 30 58 60 56 C 88 54 99 40 96 26 C 93 12 72 3 46 7 C 38 8 30 11 26 14',
  underline: 'M 2 10 C 22 6 46 4 70 6 C 82 7 92 9 98 7',
  arrow: 'M 4 40 C 20 30 44 14 86 10 M 72 2 L 87 10 L 75 21',
  arrowDown: 'M 30 4 C 22 22 24 44 34 70 M 22 58 L 34 72 L 44 57',
  tick: 'M 6 30 L 22 46 L 56 6',
  cross: 'M 8 8 L 52 52 M 52 8 L 8 52',
  scribble: 'M 4 20 C 14 6 22 34 32 18 C 42 4 48 32 58 18 C 68 6 74 30 84 16 C 90 8 94 14 96 18',
} as const;

const VIEWBOX: Record<keyof typeof SHAPES, string> = {
  circle: '0 0 100 60',
  underline: '0 0 100 14',
  arrow: '0 0 90 46',
  arrowDown: '0 0 60 76',
  tick: '0 0 60 52',
  cross: '0 0 60 60',
  scribble: '0 0 100 36',
};

interface PencilProps {
  shape: keyof typeof SHAPES;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  /** Draw immediately instead of on scroll. */
  animateNow?: boolean;
  strokeWidth?: number;
}

export function Pencil({ shape, className = '', style, delay = 0, duration = 0.9, animateNow, strokeWidth = 3 }: PencilProps) {
  const reduce = useReducedMotion();
  const draw = reduce ? {} : { pathLength: [0, 1] };
  return (
    <svg
      viewBox={VIEWBOX[shape]}
      className={`pointer-events-none overflow-visible text-cobalt ${className}`}
      style={style}
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <motion.path
        d={SHAPES[shape]}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        {...(animateNow ? { animate: draw } : { whileInView: draw })}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

/** Handwritten note in grease pencil. */
export function Hand({
  children,
  className = '',
  delay = 0,
  animateNow,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  animateNow?: boolean;
}) {
  const reduce = useReducedMotion();
  const shown = { opacity: 1, clipPath: 'inset(0 0% 0 0)' };
  return (
    <motion.span
      className={`hand inline-block text-cobalt ${className}`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
      {...(animateNow ? { animate: shown } : { whileInView: shown })}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.span>
  );
}

/** A strip of yellow masking tape. */
export function Tape({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      style={style}
      className={`pointer-events-none absolute block h-6 w-24 bg-tape/85 shadow-[0_1px_2px_rgba(0,0,0,0.15)] [clip-path:polygon(2%_0,98%_4%,100%_92%,1%_100%,3%_50%)] ${className}`}
    />
  );
}

/** Rises in when scrolled into view — used for blocks of type. */
export function Rise({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
