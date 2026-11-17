import { useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Still } from './ui/Still';
import { Hand, Pencil, Tape } from './ui/Pencil';
import { Stretch } from './ui/Stretch';
import { posterOf, projects, site, whatsappLink, type Service } from '@/content';

type Values = {
  services: string[];
  date: string;
  place: string;
  message: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  company: string; // honeypot
};
type Errors = Partial<Record<'services' | 'message' | 'name' | 'email' | 'phone', string>>;
type Status = 'idle' | 'sending' | 'sent' | 'handoff' | 'error';

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT?.trim();
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY?.trim();
const EMPTY: Values = { services: [], date: '', place: '', message: '', name: '', email: '', phone: '', budget: '', company: '' };

const serviceName = (s: Service) => [s.title, s.emphasis].filter(Boolean).join(' ');
const coverFor = (s: Service) => {
  const p = projects.find((x) => x.category === s.category);
  return p ? posterOf(p, 240) : undefined;
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.services.length) e.services = 'Tick at least one — or “something else”.';
  if (v.message.trim().length < 10) e.message = 'A sentence or two about the project helps a lot.';
  if (v.name.trim().length < 2) e.name = 'Please add your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'That email doesn’t look quite right.';
  if (v.phone && !/^[+\d][\d\s()-]{6,}$/.test(v.phone.trim())) e.phone = 'Digits, spaces and + only.';
  return e;
}

function brief(v: Values) {
  return [
    "Hi thecymer! I'd like to book a shoot.",
    '',
    `Making: ${v.services.join(', ')}`,
    v.date ? `Date: ${v.date}` : null,
    v.place ? `Where: ${v.place}` : null,
    v.budget ? `Budget: ${v.budget}` : null,
    '',
    v.message,
    '',
    `— ${v.name}`,
    v.email,
    v.phone || null,
  ]
    .filter((l): l is string => l !== null)
    .join('\n');
}

/**
 * Services and contact in one place: a booking sheet you fill in on the table.
 * Tick what you need, say when and where, and send it.
 */
export function BookingSheet({ onTerms }: { onTerms: () => void }) {
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const options = [...site.services.map(serviceName), 'Something else'];

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const toggle = (name: string) =>
    set('services', v.services.includes(name) ? v.services.filter((s) => s !== name) : [...v.services, name]);

  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    `Booking — ${v.services.join(', ') || 'new project'}`,
  )}&body=${encodeURIComponent(brief(v))}`;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`b-${first}`)?.focus();
      return;
    }
    if (v.company) return;
    if (!ENDPOINT) {
      window.open(whatsappLink(brief(v)), '_blank', 'noopener,noreferrer');
      setStatus('handoff');
      requestAnimationFrame(() => document.getElementById('book')?.scrollIntoView({ block: 'start' }));
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
          subject: `New booking — ${v.services.join(', ')}`,
          from_name: 'thecymer website',
          services: v.services.join(', '),
          date: v.date,
          location: v.place,
          budget: v.budget,
          message: v.message,
          name: v.name,
          email: v.email,
          phone: v.phone,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus('sent');
      setV(EMPTY);
      requestAnimationFrame(() => document.getElementById('book')?.scrollIntoView({ block: 'start' }));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <section id="book" aria-labelledby="book-title" className="relative bg-paper-2 px-[4vw] pb-28 pt-24 md:pb-36 md:pt-32">
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-6 text-ink/50">Sheet D — your turn</p>
          <Stretch as="h2" id="book-title" className="text-[clamp(2.8rem,9vw,9.4rem)]">
            Book a shoot
          </Stretch>
        </div>
        <div className="-rotate-2 md:max-w-sm md:text-right">
          <Hand className="text-[clamp(30px,2.6vw,40px)]">tick what you need, I’ll take it from there</Hand>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* The sheet */}
        <div className="relative lg:col-span-8">
          <div className="ruled relative px-5 pb-10 pt-8 frame-shadow md:px-12 md:pb-12 md:pt-10">
            <span aria-hidden className="absolute inset-y-0 left-3 w-px bg-cobalt/40 md:left-7" />
            <Tape className="-top-3 left-1/2 w-28 -translate-x-1/2 rotate-2" />

            <AnimatePresence mode="wait">
              {status === 'sent' || status === 'handoff' ? (
                <motion.div key="done" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10">
                  <div className="relative inline-block">
                    <span className="wide text-[clamp(2.6rem,6vw,5rem)]">{status === 'sent' ? 'Got it.' : 'Nearly there.'}</span>
                    <Pencil shape="tick" animateNow className="absolute -right-16 -top-4 h-14 w-16" strokeWidth={4} />
                  </div>
                  <p className="mt-6 max-w-lg text-lg text-ink/75">
                    {status === 'sent'
                      ? 'Your booking sheet is in. I’ll be in touch soon — usually within a day or two.'
                      : 'WhatsApp should have opened with your sheet filled in — just hit send there. If it didn’t, use one of these:'}
                  </p>
                  {status === 'handoff' && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <a href={whatsappLink(brief(v))} target="_blank" rel="noopener noreferrer" className="label bg-ink px-5 py-3.5 text-paper hover:bg-cobalt">
                        Open WhatsApp
                      </a>
                      <a href={mailto} className="label border-[1.5px] border-ink/30 px-5 py-3.5 hover:border-ink">
                        Send by email
                      </a>
                    </div>
                  )}
                  <button onClick={() => setStatus('idle')} className="label mt-8 text-ink/50 underline underline-offset-4 hover:text-ink">
                    {status === 'sent' ? 'Start a new sheet' : 'Edit my sheet'}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pl-4 md:pl-6">
                  {/* 1 — services */}
                  <Step n="1" title="What are we making?" error={errors.services} errorId="e-services">
                    <div id="b-services" tabIndex={-1} className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Services">
                      {site.services.map((s) => {
                        const name = serviceName(s);
                        const on = v.services.includes(name);
                        return (
                          <label
                            key={s.id}
                            data-cursor={on ? 'untick' : 'tick'}
                            className={`group relative flex cursor-pointer gap-4 border-[1.5px] bg-mount p-3 transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cobalt ${
                              on ? 'border-cobalt -rotate-[0.6deg] shadow-[4px_4px_0_var(--color-cobalt)]' : 'border-ink/15 hover:border-ink/50'
                            }`}
                          >
                            <input type="checkbox" checked={on} onChange={() => toggle(name)} className="sr-only" />
                            <span className="relative aspect-[9/16] w-12 shrink-0 overflow-hidden bg-paper-3">
                              <Still src={coverFor(s)} alt="" fallbackLabel=" " />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-2">
                                <span className="text-[1.05rem] font-[750] leading-tight tracking-[-0.02em] [font-stretch:112%]">{name}</span>
                                <span className={`relative mt-0.5 h-5 w-5 shrink-0 border-[1.5px] ${on ? 'border-cobalt' : 'border-ink/40'}`}>
                                  {on && <Pencil shape="tick" animateNow duration={0.35} className="absolute -left-1 -top-2 h-7 w-8" strokeWidth={3.5} />}
                                </span>
                              </span>
                              <span className="mt-1.5 block text-[13px] leading-snug text-ink/60">{s.description}</span>
                            </span>
                          </label>
                        );
                      })}
                      <label
                        className={`flex cursor-pointer items-center justify-between gap-3 border-[1.5px] bg-mount p-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cobalt ${
                          v.services.includes(options[options.length - 1]) ? 'border-cobalt shadow-[4px_4px_0_var(--color-cobalt)]' : 'border-ink/15 hover:border-ink/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={v.services.includes('Something else')}
                          onChange={() => toggle('Something else')}
                          className="sr-only"
                        />
                        <Hand className="text-[30px] text-ink">something else…</Hand>
                        <span className={`relative h-5 w-5 border-[1.5px] ${v.services.includes('Something else') ? 'border-cobalt' : 'border-ink/40'}`}>
                          {v.services.includes('Something else') && (
                            <Pencil shape="tick" animateNow duration={0.35} className="absolute -left-1 -top-2 h-7 w-8" strokeWidth={3.5} />
                          )}
                        </span>
                      </label>
                    </div>
                  </Step>

                  {/* 2 — when & where */}
                  <Step n="2" title="When & where?">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Field label="Date" optional htmlFor="b-date">
                        <input id="b-date" type="date" className="sheet-field" value={v.date} onChange={(e) => set('date', e.target.value)} />
                      </Field>
                      <Field label="Location" optional htmlFor="b-place">
                        <input
                          id="b-place"
                          className="sheet-field"
                          placeholder="City, venue or “not sure yet”"
                          value={v.place}
                          onChange={(e) => set('place', e.target.value)}
                        />
                      </Field>
                      {site.contact.askBudget && (
                        <Field label="Budget" optional htmlFor="b-budget">
                          <select id="b-budget" className="sheet-field" value={v.budget} onChange={(e) => set('budget', e.target.value)}>
                            <option value="">Select a range</option>
                            {site.contact.budgetRanges.map((b) => (
                              <option key={b}>{b}</option>
                            ))}
                          </select>
                        </Field>
                      )}
                    </div>
                  </Step>

                  {/* 3 — the story */}
                  <Step n="3" title="Tell me the story" error={errors.message} errorId="e-message">
                    <textarea
                      id="b-message"
                      rows={4}
                      className="sheet-field resize-none leading-[40px]"
                      placeholder="The occasion, the vibe, where it’ll be posted…"
                      value={v.message}
                      onChange={(e) => set('message', e.target.value)}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'e-message' : undefined}
                      aria-label="Tell me the story"
                    />
                  </Step>

                  {/* 4 — you */}
                  <Step n="4" title="And you are…">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <Field label="Name" htmlFor="b-name" error={errors.name} errorId="e-name">
                        <input
                          id="b-name"
                          className="sheet-field"
                          autoComplete="name"
                          value={v.name}
                          onChange={(e) => set('name', e.target.value)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'e-name' : undefined}
                        />
                      </Field>
                      <Field label="Email" htmlFor="b-email" error={errors.email} errorId="e-email">
                        <input
                          id="b-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          className="sheet-field"
                          value={v.email}
                          onChange={(e) => set('email', e.target.value)}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'e-email' : undefined}
                        />
                      </Field>
                      <Field label="Phone / WhatsApp" optional htmlFor="b-phone" error={errors.phone} errorId="e-phone">
                        <input
                          id="b-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          className="sheet-field"
                          value={v.phone}
                          onChange={(e) => set('phone', e.target.value)}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'e-phone' : undefined}
                        />
                      </Field>
                    </div>
                  </Step>

                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                    value={v.company}
                    onChange={(e) => set('company', e.target.value)}
                  />

                  {status === 'error' && (
                    <p role="alert" className="mt-8 border-l-4 border-[#d4380d] bg-[#d4380d]/10 p-4 text-sm">
                      That didn’t send ({serverError}). Try again, or{' '}
                      <a href={mailto} className="underline underline-offset-4">
                        email it instead
                      </a>
                      .
                    </p>
                  )}

                  <div className="mt-10 flex flex-wrap items-center gap-5">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      data-cursor="send"
                      className="group flex items-center gap-4 bg-cobalt py-2 pl-6 pr-2 text-paper transition-colors hover:bg-ink disabled:opacity-60"
                    >
                      <span className="label">{status === 'sending' ? 'Sending…' : ENDPOINT ? 'Send the sheet' : 'Send via WhatsApp'}</span>
                      <span className="flex h-11 w-11 items-center justify-center bg-paper text-ink">
                        {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />}
                      </span>
                    </button>
                    {!ENDPOINT && (
                      <a
                        href={mailto}
                        onClick={(e) => {
                          const errs = validate(v);
                          if (Object.keys(errs).length) {
                            e.preventDefault();
                            setErrors(errs);
                          }
                        }}
                        className="label text-ink/60 underline underline-offset-4 hover:text-ink"
                      >
                        or send by email
                      </a>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-ink/45">
                    {ENDPOINT
                      ? 'Your details are only used to reply to your booking.'
                      : 'Your sheet opens in WhatsApp or your email app, ready to send. Nothing is stored on this site.'}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky note: what happens next + direct lines */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[8vh]">
            <div className="relative rotate-[1.5deg] bg-tape p-6 text-coal shadow-[0_18px_30px_-14px_rgba(0,0,0,0.35)] md:p-8">
              <p className="label text-coal/60">What happens next</p>
              <ol className="mt-4 space-y-3">
                {site.process.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
                    <span className="hand text-[28px] leading-none text-[#2238ff]">{i + 1}.</span>
                    <span>
                      <span className="font-[750] [font-stretch:112%]">{s.title}</span>
                      <span className="block text-sm leading-snug text-coal/70">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <button onClick={onTerms} className="label mt-5 underline underline-offset-4 hover:text-[#2238ff]">
                Read the booking terms
              </button>
            </div>

            <ul className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
              <Line label="Email" href={`mailto:${site.contact.email}`} value={site.contact.email} />
              <Line label="WhatsApp" href={whatsappLink()} value="Message me" external />
              <Line label="Phone" href={`tel:${site.contact.phone}`} value={site.contact.phoneDisplay} />
              {site.socials.map((s) => (
                <Line key={s.label} label={s.label} href={s.href} value={s.handle} external />
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Step({ n, title, error, errorId, children }: { n: string; title: string; error?: string; errorId?: string; children: ReactNode }) {
  return (
    <fieldset className="mb-10 last:mb-0">
      <legend className="mb-5 flex items-baseline gap-3">
        <span className="hand text-[40px] leading-none text-cobalt">{n}</span>
        <span className="text-[1.35rem] font-[800] tracking-[-0.02em] [font-stretch:118%]">{title}</span>
      </legend>
      {children}
      {error && (
        <p id={errorId} className="mt-3 text-sm text-[#c2340b]">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label flex justify-between text-ink/55">
        {label}
        {optional && <span className="text-ink/30">optional</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-[#c2340b]">
          {error}
        </p>
      )}
    </div>
  );
}

function Line({ label, href, value, external }: { label: string; href: string; value: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="group flex items-center justify-between gap-3 py-3.5"
      >
        <span className="label w-20 shrink-0 text-ink/45">{label}</span>
        <span className="min-w-0 flex-1 truncate font-medium group-hover:text-cobalt">{value}</span>
        <ArrowUpRight size={15} className="shrink-0 text-ink/40 transition-transform group-hover:rotate-45 group-hover:text-cobalt" />
      </a>
    </li>
  );
}
