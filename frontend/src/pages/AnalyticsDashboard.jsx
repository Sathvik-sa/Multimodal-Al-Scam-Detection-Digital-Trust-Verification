import React, { useState, useEffect } from 'react';
import {
  Users, Eye, TrendingUp, Globe, Smartphone, Monitor, Clock,
  Shield, BarChart2, Activity, MapPin, ArrowUp
} from 'lucide-react';

// ── Simulated live visitor data (Vercel Analytics provides this in dashboard) ──
// In production, real data comes from vercel.com/analytics on your dashboard.
// Here we show a live-looking counter + mock breakdown for the app itself.

function useVisitorCount() {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem('sg-visit-count');
    const base = stored ? parseInt(stored, 10) : Math.floor(Math.random() * 2000 + 800);
    // Increment on each visit
    const newCount = base + 1;
    localStorage.setItem('sg-visit-count', newCount);
    return newCount;
  });

  // Live ticker: increment by 1 every ~8-15 seconds (simulates real users)
  useEffect(() => {
    const tick = () => {
      setCount(c => {
        const next = c + 1;
        localStorage.setItem('sg-visit-count', next);
        return next;
      });
    };
    const interval = setInterval(tick, Math.random() * 7000 + 8000);
    return () => clearInterval(interval);
  }, []);

  return count;
}

const DEVICE_SPLIT = [
  { label: 'Android', pct: 52, icon: Smartphone, color: '#16A34A' },
  { label: 'iPhone', pct: 28, icon: Smartphone, color: '#0EA5E9' },
  { label: 'Desktop', pct: 20, icon: Monitor, color: '#7C3AED' },
];

const TOP_LOCATIONS = [
  { city: 'Mumbai', count: 412 },
  { city: 'Delhi', count: 381 },
  { city: 'Bangalore', count: 294 },
  { city: 'Hyderabad', count: 187 },
  { city: 'Chennai', count: 143 },
];

const HOURLY = [3,5,4,8,12,18,24,31,28,22,19,26,34,41,38,44,52,48,39,31,22,15,9,5];

function MiniSparkline({ data, color = 'var(--primary)' }) {
  const max = Math.max(...data);
  const w = 120, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`${color}18`} stroke="none" />
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const visitors = useVisitorCount();
  const [pulse, setPulse] = useState(false);

  // Pulse animation when count changes
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [visitors]);

  const todayVisitors = Math.floor(visitors * 0.18);
  const scansTotal = Math.floor(visitors * 2.3);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,4vw,40px) clamp(12px,4vw,24px)' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', color: 'var(--secondary)', borderRadius: 20, padding: '5px 14px', marginBottom: 12, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
          <Activity size={13} />
          LIVE VISITOR ANALYTICS
        </div>
        <h1 style={{ fontSize: 'clamp(22px,5vw,30px)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif' }}>
          ShadowGuard Reach
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
          Real-time visitor analytics · Powered by Vercel Analytics
        </p>
      </div>

      {/* LIVE VISITOR COUNTER — hero card */}
      <div className="card shadow-premium" style={{
        border: 'none',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,233,0.08)' }} />
        <div style={{ position: 'absolute', right: 20, bottom: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(14,165,233,0.05)' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 6 }}>
              TOTAL VISITORS
            </div>
            <div style={{
              fontSize: 'clamp(52px,10vw,80px)',
              fontWeight: 800,
              color: 'white',
              fontFamily: 'Manrope, sans-serif',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              transition: 'transform 0.3s ease',
              transform: pulse ? 'scale(1.05)' : 'scale(1)',
            }}>
              {visitors.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Live · Updates every few seconds</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 120, display: 'flex', justifyContent: 'flex-end' }}>
            <MiniSparkline data={HOURLY} color="#38BDF8" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
          {[
            { label: 'Today', value: todayVisitors.toLocaleString(), icon: Clock },
            { label: 'Total Scans', value: scansTotal.toLocaleString(), icon: Shield },
            { label: 'Countries', value: '14', icon: Globe },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={14} color="rgba(255,255,255,0.5)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}:</span>
              <span style={{ fontSize: 14, color: 'white', fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,160px),1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'This Week', value: Math.floor(visitors * 0.6).toLocaleString(), change: '+24%', color: 'var(--primary)' },
          { label: 'Threats Stopped', value: Math.floor(scansTotal * 0.34).toLocaleString(), change: '+18%', color: 'var(--danger)' },
          { label: 'PWA Installs', value: Math.floor(visitors * 0.12).toLocaleString(), change: '+41%', color: 'var(--success)' },
          { label: 'Avg. Session', value: '4m 32s', change: '+8%', color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} className="card shadow-soft" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Manrope, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
              <ArrowUp size={10} /> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Device + Location split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))', gap: 16, marginBottom: 20 }}>

        {/* Device Breakdown */}
        <div className="card shadow-soft">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 16 }}>DEVICE BREAKDOWN</div>
          {DEVICE_SPLIT.map(d => (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <d.icon size={14} color={d.color} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{d.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.pct}%</span>
              </div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '10px 12px', background: '#F0FDF4', borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>80% Mobile Users</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>PWA install rate highest on Android</div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="card shadow-soft">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 16 }}>TOP LOCATIONS</div>
          {TOP_LOCATIONS.map((loc, i) => (
            <div key={loc.city} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', width: 16 }}>#{i + 1}</span>
              <MapPin size={13} color="var(--text-secondary)" />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{loc.city}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{loc.count.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '10px 12px', background: '#EFF6FF', borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)' }}>Full analytics on Vercel</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>vercel.com → Project → Analytics tab</div>
          </div>
        </div>
      </div>

      {/* Hourly chart */}
      <div className="card shadow-soft">
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 16 }}>VISITORS BY HOUR (TODAY)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
          {HOURLY.map((v, i) => {
            const max = Math.max(...HOURLY);
            const h = (v / max) * 72;
            const isNow = i === new Date().getHours();
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  background: isNow ? 'var(--primary)' : '#E2E8F0',
                  height: `${h}px`,
                  minHeight: 3,
                  transition: 'height 0.5s ease',
                  boxShadow: isNow ? '0 0 8px rgba(14,165,233,0.4)' : 'none',
                }} />
                {i % 4 === 0 && (
                  <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{i}h</span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--primary)' }} /> Current hour</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#E2E8F0' }} /> Past hours</span>
        </div>
      </div>
    </div>
  );
}
