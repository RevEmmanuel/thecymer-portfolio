import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Hand, Pencil, Rise, Tape } from './ui/Pencil';
import { Stretch } from './ui/Stretch';
import { site } from '@/content';

/** A taped-up collage: the portrait, the words, and the editor's notes in the margins. */
export function Hello() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const a = site.about;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const tilt = useTransform(scrollYProgress, (v) => (reduce ? -3 : -6 + v * 6));
  const lift = useTransform(scrollYProgress, (v) => (reduce ? 0 : 40 - v * 80));

  return (
    <section id="hello" ref={ref} aria-labelledby="hello-title" className="lightbox relative overflow-hidden px-[4vw] py-28 md:py-40">
      <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-12 md:gap-8">
        {/* Portrait polaroid */}
        <div className="relative mx-auto w-[78%] max-w-[440px] md:col-span-5 md:mx-0 md:w-full">
          <motion.figure className="relative bg-mount p-[4%] pb-[16%] frame-shadow-lift" style={{ rotate: tilt, y: lift }}>
            <picture className="block aspect-[4/5] overflow-hidden bg-paper-3">
              <source type="image/webp" srcSet={a.portrait.webp.join(', ')} sizes="(min-width: 768px) 36vw, 78vw" />
              <img
                src={a.portrait.jpg}
                alt={a.portrait.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[center_20%]"
              />
            </picture>
            <figcaption className="absolute bottom-[3%] left-[6%]">
              <Hand className="text-[clamp(22px,5.4vw,30px)] text-ink md:text-[clamp(26px,2.4vw,42px)]">thecymer, behind the phone</Hand>
            </figcaption>
            <Tape className="-top-3 left-[10%] -rotate-12" />
            <Tape className="-top-3 right-[8%] rotate-[14deg]" />
          </motion.figure>

        </div>

        <div className="md:col-span-7 md:pl-[3vw]">
          <p className="label mb-6 text-ink/50">Sheet B — who's filming</p>
          <h2 id="hello-title" className="text-[clamp(2.6rem,7vw,7.4rem)]">
            <Stretch>{a.headline[0]}</Stretch>
            <Stretch delay={0.12} className="text-cobalt">
              {a.headline[1]}
            </Stretch>
          </h2>
          <Rise delay={0.1}>
            <p className="mt-10 max-w-2xl text-[clamp(1.2rem,1.9vw,1.75rem)] font-medium leading-snug tracking-[-0.015em]">{a.lead}</p>
          </Rise>
          <Rise delay={0.2}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">{a.body}</p>
          </Rise>

          {/* Pillars as editor annotations */}
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-6" aria-label="Approach">
            {a.pillars.map((p, i) => (
              <li key={p} className="relative" style={{ rotate: `${[-2, 1.5, -1][i % 3]}deg` }}>
                <Hand className="text-[clamp(32px,3vw,44px)]" delay={0.2 + i * 0.25}>
                  {p.toLowerCase()}
                </Hand>
                <Pencil shape="underline" className="h-2.5 w-full" delay={0.5 + i * 0.25} />
              </li>
            ))}
          </ul>

          {/* Circled stats */}
          <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-10">
            {a.stats.map((s, i) => (
              <div key={s.label} className="relative flex flex-col-reverse">
                <dt className="mt-3 pl-5">
                  <Hand className="text-[30px] text-ink" delay={0.6 + i * 0.3}>
                    {s.label.toLowerCase()}
                  </Hand>
                </dt>
                <dd className="wide relative px-5 py-2 text-[clamp(3.6rem,7vw,6.5rem)]">
                  {s.value}
                  <Pencil shape="circle" className="absolute -inset-x-2 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+1rem)]" delay={0.3 + i * 0.3} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
