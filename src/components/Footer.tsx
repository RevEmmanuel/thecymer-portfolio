import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, Mail, Phone } from 'lucide-react';
import { TermsModal } from './TermsModal';

// Custom TikTok Icon SVG since Lucide might not have it or it looks better native
const TikTokIcon = ({ size = 22 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer id="contact" className="bg-[var(--bg)] pt-32 pb-16 px-6 md:px-12 border-t border-[var(--border)] overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="font-display font-medium text-4xl md:text-6xl mb-6">Let's create <br/> something <span className="text-gradient italic">extraordinary</span>.</h2>
          <a href="mailto:mercyogunleye06@gmail.com" className="inline-block text-xl md:text-3xl font-light hover:text-[var(--color-primary)] transition-colors border-b border-transparent hover:border-[var(--color-primary)] pb-1 mb-2">
            mercyogunleye06@gmail.com
          </a>
          <br />
          <a href="tel:+2348153177168" className="inline-block text-lg md:text-xl font-light hover:text-[var(--color-tertiary)] transition-colors border-b border-transparent hover:border-[var(--color-tertiary)] pb-1">
            +234 815 317 7168
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 md:gap-6"
        >
          <SocialLink href="https://instagram.com/thecymer" icon={<Instagram />} label="Instagram" hoverColor="hover:bg-[#E1306C]/15 hover:text-[#E1306C] hover:border-[#E1306C]" />
          <SocialLink href="https://tiktok.com/@thecymer" icon={<TikTokIcon />} label="TikTok" hoverColor="hover:bg-[#00f2fe]/15 hover:text-[#00f2fe] hover:border-[#00f2fe]" />
          <SocialLink href="mailto:mercyogunleye06@gmail.com" icon={<Mail />} label="Email" hoverColor="hover:bg-[#743ad5]/15 hover:text-[#743ad5] hover:border-[#743ad5]" />
          <SocialLink href="tel:+2348153177168" icon={<Phone />} label="Phone" hoverColor="hover:bg-[#25D366]/15 hover:text-[#25D366] hover:border-[#25D366]" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-50 relative z-10">
        <p>&copy; {new Date().getFullYear()} thecymer. All rights reserved.</p>
        <div className="flex gap-6">
          <button onClick={() => setIsTermsOpen(true)} className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</button>
          <button onClick={() => setIsTermsOpen(true)} className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</button>
        </div>
      </div>
      
      {/* Background massive text */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden flex justify-center opacity-[0.03] text-[var(--fg)] select-none">
        <span className="font-display font-bold text-[20vw] leading-[0.7] -translate-y-10 whitespace-nowrap">
          thecymer
        </span>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </footer>
  );
}

function SocialLink({ href, icon, label, hoverColor }: { href: string; icon: React.ReactNode; label: string; hoverColor: string }) {
  return (
    <a 
      href={href} 
      aria-label={label}
      target={href.startsWith('http') ? '_blank' : '_self'}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`w-14 h-14 rounded-full border border-[var(--border)] flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden text-center ${hoverColor}`}
    >
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 22 }) : icon}
    </a>
  );
}
