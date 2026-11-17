import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { interpolate, useTransform, type MotionValue } from 'motion/react';

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }));
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp({ w: window.innerWidth, h: window.innerHeight }));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return vp;
}

/* ── Body scroll lock (reference-counted so stacked dialogs behave) ── */
let lockCount = 0;
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    if (lockCount === 0) {
      const scrollbar = window.innerWidth - html.clientWidth;
      html.style.setProperty('--scrollbar-gap', `${scrollbar}px`);
      html.classList.add('is-locked');
    }
    lockCount++;
    return () => {
      lockCount--;
      if (lockCount === 0) {
        html.classList.remove('is-locked');
        html.style.removeProperty('--scrollbar-gap');
      }
    };
  }, [active]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Traps Tab inside `ref`, closes on Escape and restores focus to the opener. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape: () => void) {
  const escRef = useRef(onEscape);
  escRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const isVisible = (el: HTMLElement) => el.getClientRects().length > 0;
    const first =
      Array.from(node?.querySelectorAll<HTMLElement>('[data-autofocus]') ?? []).find(isVisible) ?? node;
    requestAnimationFrame(() => first?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        escRef.current();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === firstEl || document.activeElement === ref.current)) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [active, ref]);
}

/** Smooth-scrolls to a section, respecting reduced motion. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Formats a frame count as SMPTE-style timecode HH:MM:SS:FF. */
export function timecode(frames: number, fps = 24) {
  const f = Math.max(0, Math.floor(frames));
  const ff = f % fps;
  const s = Math.floor(f / fps);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`;
}

/**
 * Maps a motion value through ranges using a JS function transform.
 * (Avoids Motion's native ScrollTimeline acceleration, which mis-maps
 * ranges for targets that contain sticky elements.)
 */
export function useRange<T extends number | string>(
  value: MotionValue<number>,
  input: number[],
  output: T[],
): MotionValue<T extends number ? number : string> {
  return useTransform(value, (v) => interpolate(input, output as never[])(v) as T extends number ? number : string);
}
