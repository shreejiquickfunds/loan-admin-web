import { useState, useEffect, useRef } from 'react';

/* ── Persist 72-hour target across reloads ── */
const STORAGE_KEY = 'sjqf_launch_target';

// function getLaunchTarget() {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (stored) {
//       const t = parseInt(stored, 10);
//       if (!isNaN(t) && t > Date.now()) return t;
//     }
//   } catch (_) {}
//   const target = Date.now() + 72 * 60 * 60 * 1000;
//   try { localStorage.setItem(STORAGE_KEY, String(target)); } catch (_) {}
//   return target;
// }
function getLaunchTarget() {
  // Launching exactly April 20, 2026 at 12:00 AM IST
  return new Date("2026-04-20T00:00:00+05:30").getTime();
}

function getTimeLeft(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    hours:   Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    total:   diff,
  };
}

/* ── Flip-digit unit ── */
function Digit({ value, label }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      timer.current = setTimeout(() => { setPrev(value); setFlip(false); }, 350);
    }
    return () => clearTimeout(timer.current);
  }, [value, prev]);

  const d = String(value).padStart(2, '0');
  const p = String(prev).padStart(2, '0');

  return (
    <div className="cs2-unit">
      <div className={`cs2-card${flip ? ' flip' : ''}`} aria-label={`${d} ${label}`}>
        <span className="cs2-back">{p}</span>
        <span className="cs2-front">{d}</span>
      </div>
      <span className="cs2-label">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMING SOON — MINIMAL
══════════════════════════════════════════ */
export default function ComingSoon() {
  const [target]  = useState(getLaunchTarget);
  const [time, setTime] = useState(() => getTimeLeft(getLaunchTarget()));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="cs2-page">

      {/* ── Background ── */}
      <div className="cs2-bg" aria-hidden="true">
        <div className="cs2-orb cs2-orb--blue"  />
        <div className="cs2-orb cs2-orb--gold"  />
        <div className="cs2-grid" />
      </div>

      {/* ── Card ── */}
      <div className={`cs2-card-wrap${ready ? ' cs2-in' : ''}`} role="main">

        {/* Top shimmer */}
        <div className="cs2-shimmer" aria-hidden="true" />

        {/* Logo */}
        <div className="cs2-logo" aria-hidden="true">
          <div className="cs2-logo-ring" />
          <span>🏦</span>
        </div>

        {/* Headline */}
        <p className="cs2-eyebrow">Coming Soon</p>
        <h1 className="cs2-headline">
          Shree Ji <em>QuickFunds</em>
        </h1>
        <p className="cs2-sub">We're putting the finishing touches. Back in—</p>

        {/* Countdown */}
        <div className="cs2-timer" aria-live="polite">
          <Digit value={time.hours}   label="Hrs" />
          <span className="cs2-sep" aria-hidden="true">:</span>
          <Digit value={time.minutes} label="Min" />
          <span className="cs2-sep" aria-hidden="true">:</span>
          <Digit value={time.seconds} label="Sec" />
        </div>

        {/* Divider */}
        <div className="cs2-divider" aria-hidden="true" />

        {/* Contact */}
        <div className="cs2-contact">
          <a href="tel:+918890120514"       className="cs2-link">+91 88901 20514</a>
          <span aria-hidden="true">, &nbsp;</span>
          <a href="tel:+916376650799"       className="cs2-link">+91 63766 50799</a>
          <span aria-hidden="true">·</span>
          <a href="mailto:shreejiquickfunds6@gmail.com" className="cs2-link">shreejiquickfunds6@gmail.com</a>
        </div>

        {/* Footer */}
        <p className="cs2-footer">
          Powered by&nbsp;
          <a href="https://www.visiontechx.com" target="_blank" rel="noopener noreferrer" className="cs2-footer-link">
            Vision TechX
          </a>
        </p>

      </div>
    </div>
  );
}
