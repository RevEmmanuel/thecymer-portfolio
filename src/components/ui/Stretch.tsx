import { useRef, type ReactNode } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

/**
 * Kinetic display type: the variable font starts condensed and stretches
 * out to its ultra-wide cut as it comes into view — like footage being
 * de-squeezed from an anamorphic lens.
 */
export function Stretch({
  children,
  as: Tag = 'span',
  className = '',
  delay = 0,
  id,
}: {
  children: ReactNode;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const on = reduce || inView;
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      className={`wide block ${className}`}
      style={{
        fontStretch: on ? '125%' : '62%',
        opacity: on ? 1 : 0,
        transition: reduce
          ? undefined
          : `font-stretch 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity 0.5s ease ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}
