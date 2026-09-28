import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert, HelpCircle, CheckCircle, Clock, Loader } from 'lucide-react';

// ──────────────────────────────────────────
// Score Gauge (animated circular progress)
// ──────────────────────────────────────────
export function ScoreGauge({ score = 0, size = 160, label = 'TRUST SCORE' }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const dash = pct * circumference;

  const getColor = (s) => {
    if (s >= 80) return 'var(--success)';
    if (s >= 60) return '#CA8A04';
    if (s >= 40) return 'var(--warning)';
    return 'var(--danger)';
  };
  const color = getColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Background glow ring */}
        <div style={{
          position: 'absolute', inset: 4, borderRadius: '50%',
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
          animation: 'ringPulse 3s ease-in-out infinite',
        }} />
        <svg width={size} height={size}>
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
          {/* Fill */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - dash}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: size * 0.27, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Manrope, sans-serif' }}>{score}</div>
          <div style={{ fontSize: size * 0.068, color: 'var(--text-secondary)', fontWeight: 700, marginTop: 3, letterSpacing: '0.06em' }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Score Bar
// ──────────────────────────────────────────
export function ScoreBar({ label, score = 0, status }) {
  const getColor = (s) => {
    if (s >= 80) return 'var(--success)';
    if (s >= 60) return '#CA8A04';
    if (s >= 40) return 'var(--warning)';
    return 'var(--danger)';
  };
  const color = getColor(score);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {status && (
            <span className={`tag-${status === 'Safe' ? 'safe' : status === 'Fake' ? 'critical' : 'medium'}`}>
              {status}
            </span>
          )}
          <span style={{ fontSize: 15, fontWeight: 700, color }}>{score}%</span>
        </div>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Risk Badge
// ──────────────────────────────────────────
export function RiskBadge({ risk }) {
  const map = {
    Safe:     { cls: 'tag-safe',     Icon: ShieldCheck,  msg: 'Low risk. Safe to proceed.' },
    Medium:   { cls: 'tag-medium',   Icon: AlertCircle,  msg: 'Some anomalies. Verify identity.' },
    High:     { cls: 'tag-high',     Icon: AlertTriangle, msg: 'Suspicious. Proceed with caution.' },
    Critical: { cls: 'tag-critical', Icon: ShieldAlert,  msg: 'CRITICAL. Do NOT act on this.' },
    Unknown:  { cls: 'tag-medium',   Icon: HelpCircle,   msg: 'Not enough data yet.' },
  };
  const { cls, Icon, msg } = map[risk] || map['Unknown'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
      <div style={{ marginTop: 2 }}>
        <Icon size={22} className={cls} style={{ background: 'transparent', padding: 0 }} />
      </div>
      <div>
        <span className={cls} style={{ fontSize: 12, padding: '3px 10px', display: 'inline-block', marginBottom: 5 }}>{risk?.toUpperCase()} RISK</span>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>{msg}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Module Card
// ──────────────────────────────────────────
const highlightEvidence = (text) => {
  if (!text) return text;
  const keywords = ['Synthetic harmonics', 'Robotic frequency spikes', 'Frame', 'Lip mismatch', 'Lighting inconsistency', 'Face boundary artifacts'];
  
  let parts = [{ text, isKeyword: false }];
  
  keywords.forEach(kw => {
    const newParts = [];
    parts.forEach(part => {
      if (part.isKeyword) {
        newParts.push(part);
        return;
      }
      
      const lowerText = part.text.toLowerCase();
      const lowerKw = kw.toLowerCase();
      let lastIdx = 0;
      let idx = lowerText.indexOf(lowerKw);
      
      while (idx !== -1) {
        if (idx > lastIdx) {
          newParts.push({ text: part.text.substring(lastIdx, idx), isKeyword: false });
        }
        newParts.push({ text: part.text.substring(idx, idx + kw.length), isKeyword: true });
        lastIdx = idx + kw.length;
        idx = lowerText.indexOf(lowerKw, lastIdx);
      }
      if (lastIdx < part.text.length) {
        newParts.push({ text: part.text.substring(lastIdx), isKeyword: false });
      }
    });
    parts = newParts;
  });
  
  return parts.map((p, i) => 
    p.isKeyword ? <span key={i} style={{ background: '#FEF08A', color: '#854D0E', padding: '0 4px', borderRadius: 4, fontWeight: 700 }}>{p.text}</span> : <span key={i}>{p.text}</span>
  );
};

export function ModuleCard({ icon: Icon, title, result, loading }) {
  if (!result && !loading) return null;

  return (
    <div className="card shadow-soft" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <Icon size={18} />
        </div>
        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: 15, fontFamily: 'Manrope, sans-serif' }}>{title}</span>
        {loading && (
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.2s infinite' }} />
            Analyzing...
          </div>
        )}
      </div>

      {result && (
        <>
          <ScoreBar label="Authenticity" score={result.score} status={result.status} />
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.07em', marginBottom: 8 }}>EVIDENCE DETECTED</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.reasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: result.status === 'Safe' ? 'var(--success)' : 'var(--danger)', marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-main)', lineHeight: 1.5 }}>{highlightEvidence(r)}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Confidence</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{(result.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// Processing Timeline
// ──────────────────────────────────────────
export function ProcessingTimeline({ steps = [] }) {
  const allSteps = [
    { id: 'upload', label: 'File uploaded successfully' },
    { id: 'preprocess', label: 'Preprocessing complete' },
    { id: 'features', label: 'Features extracted' },
    { id: 'analyze', label: 'AI artifacts analyzed' },
    { id: 'score', label: 'Trust Score generated' },
  ];

  return (
    <div className="card shadow-soft animate-fade-in" style={{ marginBottom: 20, padding: '20px 24px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.07em', marginBottom: 14 }}>AI ANALYSIS PIPELINE</div>
      {allSteps.map((step, i) => {
        const isDone = steps.includes(step.id);
        const isActive = !isDone && steps.length === i;
        return (
          <div key={step.id}>
            <div className="timeline-step">
              <div className={`timeline-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                {isDone
                  ? <CheckCircle size={12} />
                  : isActive
                    ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBD5E1' }} />
                }
              </div>
              <span style={{ fontSize: 13, color: isDone ? 'var(--text-main)' : '#94A3B8', fontWeight: isDone ? 600 : 400 }}>
                {step.label}
              </span>
              {isDone && <CheckCircle size={14} color="var(--success)" style={{ marginLeft: 'auto' }} />}
            </div>
            {i < allSteps.length - 1 && <div className="timeline-line" />}
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────
// Spinner
// ──────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 }}>
      <div style={{ width: 20, height: 20, border: '2px solid var(--border-color)', borderTop: '2px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

// ──────────────────────────────────────────
// Waveform Visualizer
// ──────────────────────────────────────────
export function WaveformViz({ active = false, bars = 24, audioData = [] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 48 }}>
      {Array.from({ length: bars }).map((_, i) => {
        let height = 6;
        if (active) {
          if (audioData && audioData.length > 0) {
            const dataIndex = Math.floor((i / bars) * audioData.length);
            const val = audioData[dataIndex] || 0;
            // scale 0-255 to 6-48px
            height = Math.max(6, (val / 255) * 48);
          } else {
            height = Math.random() * 32 + 8;
          }
        }
        return (
          <div
            key={i}
            className="waveform-bar"
            style={{
              height: `${height}px`,
              width: 4,
              borderRadius: 2,
              background: active ? 'var(--primary)' : '#E2E8F0',
              transition: audioData?.length ? 'height 0.05s ease' : 'height 0.2s ease, background 0.3s ease',
              ...( (!audioData || audioData.length === 0) && active ? { animationDelay: `${i * 0.04}s`, animationDuration: `${0.5 + Math.random() * 0.5}s` } : {} )
            }}
          />
        );
      })}
    </div>
  );
}
