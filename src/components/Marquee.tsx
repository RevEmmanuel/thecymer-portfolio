import React from 'react';
import { motion } from 'motion/react';

export function Marquee() {
  const words = [
    "DIRECTOR OF PHOTOGRAPHY",
    "•",
    "COMMERCIAL",
    "•",
    "DOCUMENTARY",
    "•",
    "MUSIC VIDEOS",
    "•",
    "BRAND FILMS",
    "•"
  ];

  const repeated = [...words, ...words];

  return (
    <div className="relative w-full overflow-hidden bg-[var(--surface)] py-6 border-y border-[var(--border)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)] opacity-10 animate-[gradient-shift_8s_ease_infinite]" />

      <motion.div
        className="flex whitespace-nowrap items-center gap-8 px-4"
        style={{ width: "max-content" }}
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {[...repeated, ...repeated].map((word, index) => (
          <span
            key={index}
            className={`font-display font-bold uppercase tracking-wider text-xl md:text-2xl ${
              word === "•" ? "text-[var(--color-primary)]" : "text-[var(--fg)] opacity-80"
            }`}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
