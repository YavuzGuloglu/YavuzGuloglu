import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { profile } from '../../data/profile';
import { PanelContent } from './Panels';
import { LABELS, ORDER, planets, type SectionId } from './sections';

const OrbitScene = lazy(() => import('./OrbitScene'));

const ACCENTS: Record<SectionId, string> = {
  about: '#ffb347',
  contact: '#b98bff',
  ...Object.fromEntries(planets.map((p) => [p.id, p.atmosphere])),
} as Record<SectionId, string>;

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

// iPhones/iPads (including iPadOS, which reports itself as a Mac) and other
// small or weak devices get the light renderer: it is what keeps iOS Safari
// from dropping the WebGL context and going black.
function isLowPowerDevice() {
  const ua = navigator.userAgent;
  const ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  return ios || fewCores;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function OrbitApp() {
  const [selected, setSelected] = useState<SectionId | null>(null);
  const [hovered, setHovered] = useState<SectionId | null>(null);
  // the panel keeps showing the last section while it slides out
  const [shown, setShown] = useState<SectionId>('about');
  const compact = useMedia('(max-width: 767px)');
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  const [webgl, setWebgl] = useState(true);
  const [lowPowerDevice] = useState(() => typeof window !== 'undefined' && isLowPowerDevice());
  const lowPower = compact || lowPowerDevice;
  // remount the canvas after a lost WebGL context; give up after two losses
  const [contextLosses, setContextLosses] = useState(0);
  const onContextLost = useCallback(() => setContextLosses((n) => n + 1), []);

  useEffect(() => {
    if (!hasWebGL()) setWebgl(false);
  }, []);

  const select = useCallback((id: SectionId | null) => {
    setSelected(id);
    if (id) setShown(id);
    const hash = id ? `#${id}` : ' ';
    history.replaceState(null, '', hash === ' ' ? location.pathname : hash);
  }, []);

  // deep links: /#projects opens straight on that planet
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.slice(1) as SectionId;
      if (ORDER.includes(id)) select(id);
    };
    const t = setTimeout(fromHash, 900);
    window.addEventListener('hashchange', fromHash);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', fromHash);
    };
  }, [select]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const i = selected ? ORDER.indexOf(selected) : -1;
        const step = e.key === 'ArrowRight' ? 1 : -1;
        select(ORDER[(i + step + ORDER.length) % ORDER.length]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, select]);

  if (!webgl || contextLosses >= 2) {
    if (typeof window !== 'undefined') location.replace('/classic');
    return null;
  }

  const open = selected !== null;

  return (
    <div className="orbit-root" style={{ ['--accent' as string]: ACCENTS[shown] }}>
      <div className="absolute inset-0">
        <Suspense fallback={<div className="loader">Igniting the sun…</div>}>
          <OrbitScene
            key={contextLosses}
            selected={selected}
            hovered={hovered}
            onHover={setHovered}
            onSelect={select}
            compact={compact}
            reducedMotion={reducedMotion}
            lowPower={lowPower}
            onContextLost={onContextLost}
          />
        </Suspense>
      </div>

      <header className={`hud-header ${open && compact ? 'opacity-0' : ''}`}>
        <button type="button" onClick={() => select(null)} className="text-left">
          <p className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">{profile.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{profile.title}</p>
        </button>
        <a href="/classic" className="hud-link">
          Classic view
        </a>
      </header>

      <nav aria-label="Sections" className={`hud-nav ${open ? "pointer-events-none translate-y-4 opacity-0" : ""}`}>
        {ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => select(selected === id ? null : id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            aria-pressed={selected === id}
            className={`hud-nav__item ${selected === id ? 'is-active' : ''} ${hovered === id ? 'is-hovered' : ''}`}
            style={{ ['--dot' as string]: ACCENTS[id] }}
          >
            <span className="hud-nav__dot" />
            {LABELS[id]}
          </button>
        ))}
      </nav>

      {!open && <p className="hud-hint">{compact ? 'Tap a planet to explore' : 'Click a planet to explore · ← → to travel'}</p>}

      <aside className={`panel ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label={`${LABELS[shown]} details`}>
        <button type="button" className="panel-close" onClick={() => select(null)} aria-label="Back to the system">
          ✕
        </button>
        <div key={shown} className="panel-body">
          <PanelContent id={shown} />
        </div>
        <div className="panel-footer">
          <button type="button" onClick={() => select(ORDER[(ORDER.indexOf(shown) - 1 + ORDER.length) % ORDER.length])}>
            ← {LABELS[ORDER[(ORDER.indexOf(shown) - 1 + ORDER.length) % ORDER.length]]}
          </button>
          <button type="button" onClick={() => select(ORDER[(ORDER.indexOf(shown) + 1) % ORDER.length])}>
            {LABELS[ORDER[(ORDER.indexOf(shown) + 1) % ORDER.length]]} →
          </button>
        </div>
      </aside>
    </div>
  );
}
