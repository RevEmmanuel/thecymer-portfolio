import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ExternalLink, Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { embedUrl, externalUrl, type VideoSource } from '@/lib/video';

interface PlayerProps {
  source: VideoSource;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

/** Plays any configured source. Direct files get the custom player; hosted videos use their embed. */
export function VideoPlayer(props: PlayerProps) {
  return props.source.kind === 'file' ? <NativePlayer {...props} /> : <EmbedPlayer {...props} />;
}

function EmbedPlayer({ source, title, autoPlay = true, className = '' }: PlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const url = embedUrl(source, autoPlay)!;

  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div className={`relative h-full w-full bg-black ${className}`}>
      {!loaded && <Loading />}
      {!loaded && slow && (
        <a
          href={externalUrl(source)}
          target="_blank"
          rel="noopener noreferrer"
          className="label absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-snow/30 px-4 py-2 text-snow hover:border-snow"
        >
          Taking a while? Open video <ExternalLink size={12} />
        </a>
      )}
      <iframe
        key={url}
        src={url}
        title={title}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function NativePlayer({ source, title, poster, autoPlay = true, className = '' }: PlayerProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const src = source.kind === 'file' ? source.src : '';

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const seek = (t: number) => {
    const v = video.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, t));
  };

  const fullscreen = () => {
    const el = wrap.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el?.requestFullscreen) el.requestFullscreen();
    else v?.webkitEnterFullscreen?.(); // iOS Safari
  };

  const poke = () => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 2400);
  };
  useEffect(() => () => clearTimeout(idleTimer.current), []);

  const onKey = (e: KeyboardEvent) => {
    const v = video.current;
    if (!v) return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'm') setMuted((m) => !m);
    else if (e.key === 'f') fullscreen();
    else if (e.key === 'ArrowRight') {
      e.stopPropagation();
      seek(v.currentTime + 5);
    } else if (e.key === 'ArrowLeft') {
      e.stopPropagation();
      seek(v.currentTime - 5);
    }
    poke();
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const showUi = !playing || !idle;

  return (
    <div
      ref={wrap}
      className={`group/player relative h-full w-full bg-black ${className}`}
      onMouseMove={poke}
      onKeyDown={onKey}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={muted}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        controlsList="nodownload"
        className="absolute inset-0 h-full w-full object-contain"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          poke();
        }}
        onPause={() => setPlaying(false)}
        onCanPlay={() => setReady(true)}
        onError={() => setError(true)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        aria-label={title}
      />

      {!ready && !error && <Loading />}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-snow">
          <p className="label text-snow/70">This video couldn’t be loaded.</p>
          <a href={src} target="_blank" rel="noopener noreferrer" className="label underline underline-offset-4">
            Try opening it directly
          </a>
        </div>
      )}

      {!playing && ready && (
        <button
          onClick={toggle}
          aria-label="Play"
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-snow text-coal transition-transform hover:scale-105"
        >
          <Play size={24} className="ml-1 fill-current" />
        </button>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${
          showUi ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          className="mb-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-snow/20 accent-[var(--color-tape)]"
          style={{
            background: `linear-gradient(to right, var(--color-tape) ${duration ? (time / duration) * 100 : 0}%, rgb(245 243 236 / 0.25) 0)`,
          }}
        />
        <div className="label flex items-center gap-4 text-snow">
          <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="p-1">
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'} className="p-1">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="tabular-nums text-snow/70">
            {fmt(time)} / {fmt(duration)}
          </span>
          <button onClick={fullscreen} aria-label="Fullscreen" className="ml-auto p-1">
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-4 text-snow" aria-live="polite">
      <span className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border border-snow/15" />
        <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-tape" />
      </span>
      <span className="label text-snow/50">Loading film</span>
    </div>
  );
}
