# thecymer — Videography Portfolio

**Concept: THE LIGHT TABLE.** The site is laid out the way an editor reviews footage: thecymer's films are slides dropped onto a lit light table and marked up in blue grease pencil.

- **The table (opening).** The light flicks on and the slides drop into place. You can drag them around, and clicking any one lifts it off the table and projects it. Her wordmark is overprinted across the table in cobalt.
- **Shot log.** A production-paperwork index of every film: filter by discipline, highlighter-swipe a row, and a large slide previews it.
- **Hello.** A taped-up polaroid and the story, annotated in the margins.
- **Behind the shot.** BTS films pegged to a string line that sways with your scroll.
- **Book a shoot.** Services and contact in one booking sheet: tick what you need, add when and where, and send it.
- **End board.** A cobalt footer with the wordmark.
- **Navigation.** Ring-binder divider tabs on the right edge (desktop) or the bottom (phones). On desktop the cursor is a loupe.

**Lights on / lights off.** A switch in the top-right corner toggles dark mode: the same table after hours, with a dim lamp and glowing pencil. The first visit follows the visitor's system setting. Their choice is remembered, applied before the first paint (no flash), and the switch reveals the new mode in a circle spreading out from the switch.

Palette: lightbox paper `#f5f3ec`, ink `#121212`, grease-pencil cobalt `#2238ff`, masking-tape yellow `#ffd43b`. Type: Archivo (variable width, used ultra-wide for display, with headings that stretch from condensed to wide as they appear) plus Reenie Beanie for handwritten notes.

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · Motion 12 · Lucide · self-hosted fonts (Archivo Variable + Reenie Beanie via `@fontsource`).

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # type-check + production build → dist/
npm run preview
```

## Where everything lives

| What | File |
|---|---|
| Brand, table notes, about, services, process, testimonials, contact, socials, showreel | `src/content/site.ts` |
| Portfolio projects + categories | `src/content/projects.ts` |
| Colours, fonts, utility styles | `src/index.css` |
| Video source helpers (Drive / MP4 / YouTube / Vimeo) | `src/lib/video.ts` |

Lines marked `✎ TODO` in the config are placeholders waiting for real information.

## Adding a new project

1. Upload the video to Google Drive and set sharing to **Anyone with the link**.
2. Copy the id from the link: `drive.google.com/file/d/<THIS_PART>/view`.
3. Add an entry to `src/content/projects.ts`:

```ts
{
  slug: 'fashion-shoot-06',          // unique, used in the URL: /#work/fashion-shoot-06
  title: 'Fashion Shoot 06',
  category: 'fashion',               // fashion | events | birthdays | content | bts
  video: drive('PASTE_ID_HERE'),
  year: 2026,                        // optional
  client: 'Brand name',              // optional, only with permission
  description: 'One or two lines.',  // optional
  featured: true,                    // optional: included in the reel
  // poster: '/thumbnails/my-cover.webp',   // optional custom cover
  // orientation: 'horizontal',             // for 16:9 films
  // credits: [{ role: 'Stylist', name: '…' }],
  // stills: [{ src: '/images/bts/1.webp', alt: '…' }],
},
```

The light table, shot log, filters, film pages, reel and BTS line all update automatically. The first 11 projects (6 on phones) are laid on the table, so put the strongest ones first. To add a new category, add it to `categories` in the same file.

**Better video quality (recommended):** host final cuts as MP4 (Cloudinary, Bunny Stream, Vercel Blob or `/public`) and use `file('https://…/film.mp4')` in place of `drive(...)`. You get the custom player (play/pause, scrub, mute, fullscreen, keyboard shortcuts), faster loading and no Drive branding.

## Showreel

Set `site.showreel.video` in `src/content/site.ts`, e.g. `file('/reel.mp4')` or `drive('…')`. Until that's set, *Watch the reel* plays the **featured** projects as chapters.

## Booking form

The form validates input and then:

- **If `VITE_FORM_ENDPOINT` is set:** posts JSON to that endpoint, with sending, success and error states. Works with Formspree, or with Web3Forms if you also set `VITE_FORM_ACCESS_KEY`. Add these in Vercel → Project → Settings → Environment Variables, then redeploy.
- **Otherwise:** opens WhatsApp with the brief already written, with email as a fallback. Nothing is faked; the enquiry lands in a channel that actually gets read.

The WhatsApp number is `site.contact.whatsapp`. Set `site.contact.askBudget` to `true` to show a budget range field.

## Testimonials

Add genuine quotes to `site.testimonials`. They appear as sticky notes, and the section stays hidden while the list is empty.

## Accessibility & performance notes

- Respects `prefers-reduced-motion`: no light flicker, no dropping or swaying slides, no stretching type, and the pencil marks appear already drawn.
- Dialogs trap focus, close on Esc and lock background scroll. Project pages are deep-linkable (`/#work/<slug>`) and close with the back button.
- The loupe cursor and slide dragging only run with a mouse. Touch devices tap to play.
- Videos never autoload: embeds mount only when opened, and hover previews use `preload="none"`.
