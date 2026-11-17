import { autoPoster } from '@/lib/video';
import { categories, projects } from './projects';
import type { CategoryId, Project } from './types';

export { site, whatsappLink } from './site';
export { categories, projects };
export type * from './types';

export const posterOf = (p: Project, width = 800) => p.poster || autoPoster(p.video, width) || '';

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const featuredProjects = () => {
  const f = projects.filter((p) => p.featured);
  return f.length ? f : projects.slice(0, 6);
};

export const pad = (n: number, len = 2) => String(n).padStart(len, '0');
