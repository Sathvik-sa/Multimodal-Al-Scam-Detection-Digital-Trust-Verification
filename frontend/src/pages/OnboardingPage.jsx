import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Mic, Video, Image as ImageIcon, MessageSquare,
  Smartphone, ChevronRight, CheckCircle, Download, Play,
  Wifi, BarChart2, ArrowRight, Star
} from 'lucide-react';

const STEPS = [
  {
    icon: Smartphone,
    color: '#0EA5E9',
    bg: '#EFF6FF',
    title: 'Open on Your Phone',
    desc: 'Visit the website in Chrome (Android) or Safari (iPhone). No download needed.',
    tip: 'Works on Samsung, OnePlus, Pixel, iPhone',
  },
  {
    icon: Download,
    color: '#16A34A',
    bg: '#F0FDF4',
    title: 'Install Like an App',
    desc: 'Tap the banner or browser menu → "Add to Home Screen". One tap — done!',
    tip: 'Android: Chrome ⋮ → Add to Home Screen\niPhone: Share → Add to Home Screen',
  },
  {
    icon: Shield,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Launch & Scan',
    desc: 'Open from your home screen. Tap any shield to upload and scan instantly.',
    tip: 'Full-screen, no browser bar — feels like a real app',
  },
  {
    icon: Wifi,
    color: '#EA580C',
    bg: '#FFF7ED',
    title: 'Use Live Detection',
    desc: 'Tap Live tab → Start Voice or Camera scan. Real-time AI analysis every 3 seconds.',
    tip: 'Allow microphone & camera when prompted',
  },
];

const FEATURES = [
  { icon: Mic, label: 'Voice Shield', desc: 'Detect cloned voices', color: '#0EA5E9' },
  { icon: Video, label: 'Video Shield', desc: 'Catch deepfake videos', color: '#7C3AED' },
  { icon: ImageIcon, label: 'Image Shield', desc: 'Spot AI-generated images', color: '#EA580C' },
  { icon: MessageSquare, label: 'Social Shield', desc: 'Flag scam messages', color: '#16A34A' },
];

export default function OnboardingPage({ onDone }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem('sg-onboarded', '1');
    if (onDone) onDone();
    navigate('/');
  };

  // Full intro slides
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-color)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '20px 16px 0' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 4, borderRadius: 2,
            width: i === step ? 24 : 8,
            background: i <= step ? 'var(--primary)' : '#E2E8F0',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 24px 0' }}>
        <div key={step} className="animate-fade-in" style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 28,
            background: STEPS[step].bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: `0 8px 32px ${STEPS[step].color}22`,
          }}>
            {React.createElement(STEPS[step].icon, { size: 44, color: STEPS[step].color, strokeWidth: 1.5 })}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif', marginBottom: 12, lineHeight: 1.2 }}>
            {STEPS[step].title}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            {STEPS[step].desc}
          </p>

          {/* Tip box */}
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: '14px 16px', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 6 }}>PRO TIP</div>
            <div style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 500, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {STEPS[step].tip}
            </div>
          </div>

          {/* Feature icons on last step */}
          {step === STEPS.length - 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              {FEATURES.map(f => (
                <div key={f.label} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <f.icon size={18} color={f.color} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{f.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: '24px' }}>
        {step < STEPS.length - 1 ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn-secondary"
              style={{ flex: 0, padding: '14px 20px', fontSize: 14, borderRadius: 14 }}
              onClick={finish}
            >
              Skip
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: '14px 20px', fontSize: 16, borderRadius: 14 }}
              onClick={() => setStep(s => s + 1)}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '16px 20px', fontSize: 16, borderRadius: 14 }}
            onClick={finish}
          >
            <Play size={18} /> Start Scanning Now
          </button>
        )}
      </div>
    </div>
  );
}
