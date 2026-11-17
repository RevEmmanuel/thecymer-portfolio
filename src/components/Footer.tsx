import { ArrowUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Hand } from './ui/Pencil';
import { site, whatsappLink } from '@/content';

/** Lights off: a cobalt end board with the wordmark at full width. */
export function Footer({ onTerms }: { onTerms: () => void }) {
  const reduce = useReducedMotion();
  return (
    <footer data-tone="dark" className="relative overflow-hidden bg-blueprint pb-24 pt-20 text-snow md:pb-8 md:pt-24">
      <div className="grid grid-cols-1 gap-10 px-[4vw] md:grid-cols-12">
        <div className="md:col-span-6">
          <Hand className="text-[clamp(36px,3.6vw,56px)] text-tape">the best stories deserve to be seen.</Hand>
          <a href={`mailto:${site.contact.email}`} className="mt-6 block break-all text-[clamp(1.3rem,2.6vw,2.4rem)] font-[750] tracking-[-0.02em] [font-stretch:112%] hover:text-tape">
            {site.contact.email}
          </a>
          <a href={`tel:${site.contact.phone}`} className="mt-1 block text-snow/70 hover:text-snow">
            {site.contact.phoneDisplay}
          </a>
        </div>
        <nav aria-label="Elsewhere" className="md:col-span-3">
          <p className="label text-snow/50">Elsewhere</p>
          <ul className="mt-3 space-y-1.5 text-lg">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-tape">
                  {s.label} <span className="label text-snow/50">{s.handle}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-tape">
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-3 md:text-right">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="label inline-flex items-center gap-3 bg-snow px-5 py-3.5 text-coal transition-transform hover:-rotate-2"
          >
            Back to the table <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="mt-16 px-[2vw] md:mt-24"
        initial={reduce ? false : { y: '30%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="wordmark block w-full text-snow" />
      </motion.div>

      <div className="label mt-8 flex flex-col gap-3 border-t border-snow/20 px-[4vw] pt-5 text-snow/55 md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} {site.brand.name} · {site.brand.role}
        </span>
        <button onClick={onTerms} className="text-left hover:text-snow">
          Booking terms
        </button>
      </div>
    </footer>
  );
}
