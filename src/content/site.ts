import type { VideoSource } from '@/lib/video';
import type { ProcessStep, Service, Still, Testimonial } from './types';

/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit everything about the site here.
 * ─────────────────────────────────────────────────────────────
 *  Lines marked  ✎ TODO  are placeholders waiting for real info.
 */
export const site = {
  brand: {
    name: 'thecymer',
    role: 'Mobile videographer & storyteller',
    /** ✎ TODO: add a city (e.g. "Lagos, Nigeria") if you want it shown. */
    location: 'Wherever the story takes me',
    url: 'https://thecymer.vercel.app',
  },

  /** The opening "light table". Notes are written in grease-pencil handwriting. */
  intro: {
    note: "hi, I'm thecymer —",
    noteTwo: 'I film fashion, birthdays, events & content… on my phone.',
    pickNote: 'pick any frame',
    tagline: 'Small camera. Big stories.',
    /** Number of projects laid on the table (desktop / mobile). */
    onTable: { desktop: 11, mobile: 6 },
  },

  /**
   * The reel. Set `video` to a dedicated showreel (ideally an MP4 via `file('/reel.mp4')`).
   * ✎ TODO: no showreel has been supplied yet, so the reel currently plays the
   * featured projects as chapters.
   */
  showreel: {
    video: null as VideoSource | null,
    orientation: 'vertical' as 'vertical' | 'horizontal',
    poster: '' as string,
  },

  about: {
    headline: ['The person', 'behind the phone.'],
    lead:
      "I'm thecymer — a mobile videographer and storyteller. I make content videos, fashion and brand films, birthday shoots and event coverage, and I go wherever the story takes me.",
    body:
      'My approach is rooted in raw emotion, authentic moments and striking compositions. Whether it is a brand or a birthday, I want the finished film to feel like you were there — and to make you want to watch it again.',
    pillars: ['Raw emotion', 'Authentic moments', 'Striking compositions'],
    stats: [
      { value: '50+', label: 'Projects delivered' },
      { value: '2+', label: 'Years filming' },
    ],
    portrait: {
      webp: ['/images/portrait-640.webp 640w', '/images/portrait-1170.webp 1170w'],
      jpg: '/images/portrait-1170.jpg',
      alt: 'Portrait of thecymer seated in a charcoal dress against a warm studio backdrop',
    },
  },

  services: [
    {
      id: 'content',
      title: 'Content',
      emphasis: 'videos',
      description:
        'Short-form, scroll-stopping videos for creators, businesses and brands — built for the feed and the story.',
      tags: ['Reels', 'TikTok', 'Short-form'],
      category: 'content',
    },
    {
      id: 'fashion',
      title: 'Fashion &',
      emphasis: 'brand films',
      description:
        'Movement, texture and attitude. Lookbooks, campaign clips and brand shoots that make the clothes and the people feel alive.',
      tags: ['Lookbooks', 'Campaigns', 'Brand shoots'],
      category: 'fashion',
    },
    {
      id: 'events',
      title: 'Event',
      emphasis: 'coverage',
      description:
        'The energy of the room, the details people miss and the moments that only happen once — cut into a film worth sharing.',
      tags: ['Launches', 'Parties', 'Gatherings'],
      category: 'events',
    },
    {
      id: 'birthdays',
      title: 'Birthday',
      emphasis: 'shoots',
      description:
        'Your day, your people, your look. Cinematic birthday films and shoots that feel like a main-character moment.',
      tags: ['Birthday films', 'Shoots'],
      category: 'birthdays',
    },
    {
      id: 'bts',
      title: 'Behind',
      emphasis: 'the scenes',
      description:
        'BTS content for photographers, stylists, brands and productions — the process, the people and the magic around the shot.',
      tags: ['BTS', 'Process', 'Productions'],
      category: 'bts',
    },
  ] satisfies Service[],

  /** Built from thecymer's booking terms. Adjust wording freely. */
  process: [
    {
      title: 'Book',
      body: 'Tell me the story, the date and the vibe. A 50% deposit locks your date in.',
    },
    {
      title: 'Plan',
      body: 'We shape the look together — references, locations, timing and the moments that matter most.',
    },
    {
      title: 'Shoot',
      body: 'On set or on the move. A phone means I can go where bigger rigs can’t, and stay close to the moment.',
    },
    {
      title: 'Cut',
      body: 'Edit, colour and sound — shaped for where the film will live, from the feed to the big screen.',
    },
    {
      title: 'Deliver',
      body: 'Your film in 24–72 hours depending on scope, with 1–2 rounds of revisions included.',
    },
  ] satisfies ProcessStep[],

  /**
   * ✎ TODO: add genuine client testimonials. The section stays hidden while this is empty.
   * Example: { quote: '…', name: 'Client name', role: 'Bride, 2025', project: 'birthday-shoot-01' }
   */
  testimonials: [] as Testimonial[],

  /** Behind-the-scenes photos (in /public/images/bts/). The BTS films are pulled from projects automatically. */
  btsStills: [] as Still[],

  contact: {
    email: 'mercyogunleye06@gmail.com',
    phoneDisplay: '+234 815 317 7168',
    phone: '+2348153177168',
    /** ✎ Confirm this is the WhatsApp number. Digits only, with country code. */
    whatsapp: '2348153177168',
    /** Ask for a budget range in the booking form? */
    askBudget: false,
    budgetRanges: ['Under ₦100k', '₦100k – ₦250k', '₦250k – ₦500k', '₦500k+'],
  },

  socials: [
    { label: 'Instagram', handle: '@thecymer', href: 'https://instagram.com/thecymer' },
    { label: 'TikTok', handle: '@thecymer', href: 'https://tiktok.com/@thecymer' },
  ],
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
