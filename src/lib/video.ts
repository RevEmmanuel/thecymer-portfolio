/**
 * Video sources supported by the site.
 *
 * - `drive`   — a Google Drive file shared as "Anyone with the link". Plays in Drive's own player.
 * - `file`    — a direct video file (MP4/WebM) in /public or on a CDN. Gets the custom player.
 * - `youtube` / `vimeo` — standard embeds.
 *
 * For the best experience (custom controls, hover previews, a looping hero),
 * host final cuts as MP4 files and use `file(...)`.
 */
export type VideoSource =
  | { kind: 'drive'; id: string }
  | { kind: 'file'; src: string; mime?: string }
  | { kind: 'youtube'; id: string }
  | { kind: 'vimeo'; id: string };

export const drive = (id: string): VideoSource => ({ kind: 'drive', id });
export const file = (src: string, mime = 'video/mp4'): VideoSource => ({ kind: 'file', src, mime });
export const youtube = (id: string): VideoSource => ({ kind: 'youtube', id });
export const vimeo = (id: string): VideoSource => ({ kind: 'vimeo', id });

/** URL for an <iframe> player, or null for direct files. */
export function embedUrl(v: VideoSource, autoplay = true): string | null {
  switch (v.kind) {
    case 'drive':
      return `https://drive.google.com/file/d/${v.id}/preview`;
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1${autoplay ? '&autoplay=1' : ''}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${v.id}?dnt=1&title=0&byline=0&portrait=0${autoplay ? '&autoplay=1' : ''}`;
    default:
      return null;
  }
}

/** A link that opens the video on its host, used as a fallback if the embed fails. */
export function externalUrl(v: VideoSource): string {
  switch (v.kind) {
    case 'drive':
      return `https://drive.google.com/file/d/${v.id}/view`;
    case 'youtube':
      return `https://www.youtube.com/watch?v=${v.id}`;
    case 'vimeo':
      return `https://vimeo.com/${v.id}`;
    case 'file':
      return v.src;
  }
}

/** Auto-generated poster frame for hosted videos (Drive / YouTube). */
export function autoPoster(v: VideoSource, width = 800): string | undefined {
  if (v.kind === 'drive') return `https://drive.google.com/thumbnail?id=${v.id}&sz=w${width}`;
  if (v.kind === 'youtube') return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  return undefined;
}
