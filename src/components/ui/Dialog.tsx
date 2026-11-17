import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useBodyScrollLock, useFocusTrap } from '@/lib/hooks';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  /** Visual entrance. 'shutter' wipes up like a film gate; 'fade' simply fades. */
  variant?: 'shutter' | 'fade';
}

/** Accessible full-screen dialog: portal, focus trap, Escape to close, scroll lock. */
export function Dialog({ open, onClose, label, children, className = '', variant = 'shutter' }: DialogProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <DialogInner onClose={onClose} label={label} className={className} variant={variant}>
          {children}
        </DialogInner>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function DialogInner({ onClose, label, children, className, variant }: Omit<DialogProps, 'open'>) {
  const ref = useRef<HTMLDivElement>(null);
  useBodyScrollLock(true);
  useFocusTrap(ref, true, onClose);

  const motionProps =
    variant === 'shutter'
      ? {
          initial: { clipPath: 'inset(100% 0% 0% 0%)' },
          animate: { clipPath: 'inset(0% 0% 0% 0%)' },
          exit: { clipPath: 'inset(0% 0% 100% 0%)' },
          transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.35 },
        };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      className={`fixed inset-0 z-[100] outline-none ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
