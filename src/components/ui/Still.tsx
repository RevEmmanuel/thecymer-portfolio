import { useState, type ImgHTMLAttributes } from 'react';

interface StillProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  /** Text shown if the image is missing or fails to load. */
  fallbackLabel?: string;
}

/**
 * Image that fades in when decoded and degrades to a styled slate if it fails
 * (e.g. a Drive thumbnail that isn't public). Fills its positioned parent.
 */
export function Still({ src, alt = '', fallbackLabel, className = '', ...rest }: StillProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(src ? 'loading' : 'error');

  if (state === 'error' || !src) {
    return (
      <div
        className={`absolute inset-0 flex items-end bg-[repeating-linear-gradient(135deg,var(--color-paper-3)_0_8px,var(--color-paper-2)_8px_16px)] p-3 ${className}`}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        <span className="label text-ink/50">{fallbackLabel ?? 'Frame unavailable'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setState('ready')}
      onError={() => setState('error')}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
        state === 'ready' ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...rest}
    />
  );
}
