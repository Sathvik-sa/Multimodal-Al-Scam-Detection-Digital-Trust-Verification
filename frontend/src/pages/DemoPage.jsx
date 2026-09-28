import React, { useState } from 'react';
import { Play, Download, CheckCircle, Smartphone, AlertCircle, RefreshCw, FileText, Activity } from 'lucide-react';
import { ScoreGauge, RiskBadge, ScoreBar, ModuleCard } from '../components/UIComponents';
import { downloadTrustCapsule } from '../trustCapsule';

const DEMO_SCENARIOS = [
  {
    id: 'digital-arrest',
    title: 'Digital Arrest Scam',
    type: 'text',
    desc: 'Fake CBI notice demanding ₹50,000 for money laundering case.',
    trustScore: 8,
    risk: 'Critical',
    recommendation: 'CRITICAL WARNING: This is a known Digital Arrest scam pattern. Do NOT transfer money. Block the number and report to 1930 immediately.',
    results: {
      text: { score: 5, status: 'Fake', confidence: 0.98, reasons: ['Digital Arrest scam keyword found', 'Demand for ₹50,000 detected', 'Urgency pressure detected'] }
    }
  },
  {
    id: 'voice-clone',
    title: 'Emergency Family Voice Clone',
    type: 'voice',
    desc: 'Cloned voice of a family member asking for ₹15,000 urgently.',
    trustScore: 18,
    risk: 'Critical',
    recommendation: 'CRITICAL WARNING: Voice clone detected. Verify with a trusted contact on a known phone number before proceeding.',
    results: {
      voice: { score: 18, status: 'Fake', confidence: 0.96, reasons: ['Vocoder artifacts detected in 200-400Hz range', 'Synthetic breathing patterns found'] },
      text: { score: 12, status: 'Fake', confidence: 0.94, reasons: ['Financial demand for ₹15,000', 'Emergency context detected'] }
    }
  },
  {
    id: 'fake-job',
    title: 'Work From Home Offer',
    type: 'text',
    desc: 'WhatsApp job offer asking for ₹1,999 registration fee.',
    trustScore: 22,
    risk: 'High',
    recommendation: 'HIGH RISK: Legitimate jobs do not ask for registration fees. Do not pay or share documents.',
    results: {
      text: { score: 22, status: 'Fake', confidence: 0.92, reasons: ['Registration fee demand', 'Unrealistic salary expectations', 'Urgent joining pressure'] }
    }
  },
  {
    id: 'kyc-scam',
    title: 'Bank KYC Expiry Link',
    type: 'text',
    desc: 'SMS claiming HDFC account is blocked unless link is clicked.',
    trustScore: 15,
    risk: 'Critical',
    recommendation: 'CRITICAL WARNING: Phishing attempt. Do not click the link or share OTPs. Contact your bank directly.',
    results: {
      text: { score: 15, status: 'Fake', confidence: 0.97, reasons: ['Account block threat', 'Suspicious bit.ly URL', 'OTP demand'] }
    }
  },
];

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runDemo = (demo) => {
    setIsSimulating(true);
    setTimeout(() => {
      setActiveDemo(demo);
      setIsSimulating(false);
    }, 1200); // 1.2s delay for realism
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px) clamp(12px, 4vw, 24px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', color: 'var(--secondary)', borderRadius: 20, padding: '5px 14px', marginBottom: 12, fontSize: 12, fontWeight: 800, letterSpacing: '0.06em' }}>
          <Play size={14} /> LIVE DEMO SCENARIOS
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif' }}>
          Test ShadowGuard Instantly
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
          Click any common scam scenario below to see how ShadowGuard analyzes and protects you.
        </p>
      </div>

      {!activeDemo ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {DEMO_SCENARIOS.map(demo => (
            <div key={demo.id} className="card shadow-hover" style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif' }}>{demo.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5, flex: 1 }}>{demo.desc}</div>
              <button 
                onClick={() => runDemo(demo)}
                className="btn-primary" 
                style={{ width: '100%', marginTop: 20, padding: '12px', fontSize: 14 }}
              >
                <Play size={16} /> Run Analysis
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <button className="btn-secondary" style={{ marginBottom: 20 }} onClick={() => setActiveDemo(null)}>
            <RefreshCw size={16} /> Back to Scenarios
          </button>
          
          {/* Re-use exactly what was built in the Decision Dashboard */}
          <div className="card shadow-premium" style={{ marginBottom: 24, border: `1px solid ${activeDemo.risk === 'Safe' ? 'var(--success)' : 'var(--danger)'}40`, background: activeDemo.risk === 'Safe' ? '#F0FDF4' : '#FEF2F2' }}>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <ScoreGauge score={activeDemo.trustScore} size={180} />
              <div style={{ flex: 1, minWidth: 260 }}>
                <RiskBadge risk={activeDemo.risk} />
                <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 6 }}>AI RECOMMENDATION</div>
                  <p style={{ fontSize: 15, color: 'var(--text-main)', lineHeight: 1.6, fontWeight: 600 }}>{activeDemo.recommendation}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
            {Object.entries(activeDemo.results).map(([key, res]) => (
               <div key={key} className="card shadow-soft">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Activity size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 15, textTransform: 'capitalize' }}>{key} Evidence</span>
                  </div>
                  <ScoreBar label="Authenticity" score={res.score} status={res.status} />
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {res.reasons.map((r, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>
                        <AlertCircle size={14} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                        {r}
                      </li>
                    ))}
                  </ul>
               </div>
            ))}
          </div>
        </div>
      )}

      {isSimulating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card shadow-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 48px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #E2E8F0', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>AI is scanning artifacts...</div>
          </div>
        </div>
      )}
    </div>
  );
}
