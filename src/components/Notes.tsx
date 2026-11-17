import { motion } from 'motion/react';
import { Stretch } from './ui/Stretch';
import { projectBySlug, site } from '@/content';

/**
 * Kind words, stuck to the table as sticky notes.
 * Renders only when genuine testimonials are added in src/content/site.ts.
 */
export function Notes() {
  const items = site.testimonials;
  if (!items.length) return null;
  const colors = ['bg-tape text-coal', 'bg-mount text-ink', 'bg-[#cfe0ff] text-coal'];
  return (
    <section aria-labelledby="notes-title" className="lightbox px-[4vw] py-24 md:py-32">
      <Stretch as="h2" id="notes-title" className="mb-14 text-[clamp(2.6rem,7vw,7rem)]">
        Notes left behind
      </Stretch>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => {
          const project = t.project ? projectBySlug(t.project) : undefined;
          return (
            <motion.li
              key={t.name + i}
              className={`${colors[i % colors.length]} p-7 shadow-[0_18px_30px_-14px_rgba(0,0,0,0.3)]`}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: [-2.5, 1.8, -1][i % 3] }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 160, damping: 16, delay: i * 0.08 }}
            >
              <blockquote className="hand text-[clamp(28px,2.4vw,36px)]">“{t.quote}”</blockquote>
              <p className="label mt-5 opacity-60">
                {t.name}
                {t.role && ` · ${t.role}`}
                {project && <span className="text-cobalt"> · {project.title}</span>}
              </p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
