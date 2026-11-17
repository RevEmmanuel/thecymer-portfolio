import { drive } from '@/lib/video';
import type { Category, Project } from './types';

/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO PROJECTS
 * ─────────────────────────────────────────────────────────────
 *  To add a new film:
 *   1. Upload it to Google Drive and set sharing to "Anyone with the link".
 *   2. Copy the file id from the link: drive.google.com/file/d/<THIS_PART>/view
 *   3. Add an entry below with a unique `slug`.
 *  The gallery, filters, project pages and counts update automatically.
 *  Order here = order on the site.
 */

export const categories: Category[] = [
  { id: 'fashion', label: 'Fashion' },
  { id: 'events', label: 'Events' },
  { id: 'birthdays', label: 'Birthdays' },
  { id: 'content', label: 'Content' },
  { id: 'bts', label: 'Behind the scenes' },
];

export const projects: Project[] = [
  {
    slug: 'fashion-shoot-01',
    title: 'Fashion Shoot 01',
    category: 'fashion',
    featured: true,
    video: drive('1S8_65ujyOUTW9DQmxvuzKbazeoA3tP7s'),
  },
  {
    slug: 'event-coverage-02',
    title: 'Event Coverage 02',
    category: 'events',
    featured: true,
    poster: '/thumbnails/event-coverage-02.webp',
    video: drive('1h1Qa8tHsJVhpoUSFgVCM9FhbN6KGcd0-'),
  },
  {
    slug: 'birthday-shoot-01',
    title: 'Birthday Shoot 01',
    category: 'birthdays',
    featured: true,
    video: drive('1AeiTeeG_yxQaVQM-AN1SjvuDYaTHW08g'),
  },
  {
    slug: 'content-video-01',
    title: 'Content Video 01',
    category: 'content',
    featured: true,
    video: drive('1L59OYYhuqE5i1qeHwQ3XX7b0HogdtLqF'),
  },
  {
    slug: 'fashion-shoot-02',
    title: 'Fashion Shoot 02',
    category: 'fashion',
    featured: true,
    video: drive('1Yh99lrqfjpYkFTOj4EItVb2e5zR1f5Pq'),
  },
  {
    slug: 'event-coverage-01',
    title: 'Event Coverage 01',
    category: 'events',
    featured: true,
    video: drive('17VkhgOZcsmQ--u3WuHhcvHPqrtkMJa6P'),
  },
  {
    slug: 'birthday-shoot-02',
    title: 'Birthday Shoot 02',
    category: 'birthdays',
    video: drive('1PorQHpAO4Fg2-ZAav65C9vMpldBUPbpK'),
  },
  {
    slug: 'bts-01',
    title: 'BTS 01',
    category: 'bts',
    video: drive('1QOHZ1gYuyJUxh2g1iAXJYsqKgKTGVNQV'),
  },
  {
    slug: 'fashion-shoot-03',
    title: 'Fashion Shoot 03',
    category: 'fashion',
    video: drive('1AfaFGI6CnNGuLZr9EU_jyfv6a71pVIi3'),
  },
  {
    slug: 'event-coverage-03',
    title: 'Event Coverage 03',
    category: 'events',
    video: drive('1aiQS5tjkWLnGK_vAi8t_IZ-gl9YKxx2N'),
  },
  {
    slug: 'birthday-shoot-03',
    title: 'Birthday Shoot 03',
    category: 'birthdays',
    video: drive('10OYtIyqpqb885e4aL2X1-wrW1gDvsQhj'),
  },
  {
    slug: 'fashion-shoot-04',
    title: 'Fashion Shoot 04',
    category: 'fashion',
    video: drive('1oR7_2hm5_IkMl5mF6sZiXpVspiTBC5EU'),
  },
  {
    slug: 'bts-02',
    title: 'BTS 02',
    category: 'bts',
    video: drive('1NV9rieIeKHQ4OUBTk9b2PRgVOks-pAYA'),
  },
  {
    slug: 'event-coverage-04',
    title: 'Event Coverage 04',
    category: 'events',
    video: drive('1P-VyyeYKjY-QUJg7_bzwRqye5ectvpX7'),
  },
  {
    slug: 'birthday-shoot-04',
    title: 'Birthday Shoot 04',
    category: 'birthdays',
    video: drive('1kcjUx4cWOKBQ2LXGMnP2pIBQEKLfBXP-'),
  },
  {
    slug: 'fashion-shoot-05',
    title: 'Fashion Shoot 05',
    category: 'fashion',
    video: drive('1WLV46O787FLI-h3_P3zoZHGAx9L0QPE9'),
  },
  {
    slug: 'bts-03',
    title: 'BTS 03',
    category: 'bts',
    video: drive('1GxqfmzvMlsLixg0OCrJhCvHUYWocHrdO'),
  },
];
