import { X } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Tape } from './ui/Pencil';

const TERMS: { title: string; items: string[] }[] = [
  { title: 'Booking & payment', items: ['A non-refundable deposit (50%) is required to secure bookings.', 'Balance must be paid before delivery of final content.'] },
  { title: 'Delivery timeline', items: ['Standard delivery: 24–72 hours (depending on project scope).', 'Delays may occur if revisions exceed agreed scope.'] },
  { title: 'Revisions', items: ['Includes 1–2 free revisions.', 'Additional revisions may attract extra charges.'] },
  {
    title: 'Usage rights',
    items: ['Client can use delivered content for personal/business promotion.', 'Thecymer retains the right to use content for portfolio & marketing.'],
  },
  { title: 'Cancellations', items: ['Deposits are non-refundable.', 'Rescheduling must be communicated at least 24 hours before.'] },
];

export function Terms({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} label="Booking terms" variant="fade" className="bg-coal/55 backdrop-blur-[2px]">
      <div className="flex h-full items-end justify-center md:items-center md:p-8" onClick={onClose}>
        <div
          className="ruled relative flex max-h-[88svh] w-full max-w-2xl -rotate-[0.6deg] flex-col frame-shadow-lift"
          onClick={(e) => e.stopPropagation()}
        >
          <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
          <div className="flex items-center justify-between px-6 pb-2 pt-7 md:px-10">
            <h2 className="wide text-[clamp(1.8rem,4vw,2.6rem)]">Booking terms</h2>
            <button onClick={onClose} data-autofocus aria-label="Close terms" className="flex h-10 w-10 items-center justify-center bg-ink text-paper hover:bg-cobalt">
              <X size={16} />
            </button>
          </div>
          <ol className="overflow-y-auto px-6 pb-8 md:px-10">
            {TERMS.map((t, i) => (
              <li key={t.title} className="border-b border-ink/10 py-4 last:border-0">
                <h3 className="flex items-baseline gap-3 font-[750] [font-stretch:112%]">
                  <span className="hand text-[28px] text-cobalt">{i + 1}.</span>
                  {t.title}
                </h3>
                <ul className="mt-1 space-y-1 pl-8 text-ink/70">
                  {t.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Dialog>
  );
}
