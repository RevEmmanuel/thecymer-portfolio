import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl max-h-[85vh] bg-[var(--surface)] text-[var(--fg)] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-[var(--border)]">
              <h2 className="font-display font-bold text-2xl md:text-3xl">Terms & Policy</h2>
              <button 
                onClick={onClose}
                className="p-2 bg-[var(--bg)] hover:bg-[var(--border)] rounded-full transition-colors z-[101]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              <div className="space-y-8 text-sm md:text-base opacity-80 leading-relaxed font-sans pb-12">
                <section>
                  <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 font-display">1. Booking & Payment</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A non-refundable deposit (50%) is required to secure bookings.</li>
                    <li>Balance must be paid before delivery of final content.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 font-display">2. Delivery Timeline</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Standard delivery: 24–72 hours (depending on project scope).</li>
                    <li>Delays may occur if revisions exceed agreed scope.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 font-display">3. Revisions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Includes 1–2 free revisions.</li>
                    <li>Additional revisions may attract extra charges.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 font-display">4. Usage Rights</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Client can use delivered content for personal/business promotion.</li>
                    <li>Thecymer retains the right to use content for portfolio & marketing.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 font-display">5. Cancellations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Deposits are non-refundable.</li>
                    <li>Rescheduling must be communicated at least 24 hours before.</li>
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
