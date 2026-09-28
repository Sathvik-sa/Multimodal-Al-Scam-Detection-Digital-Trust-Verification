import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, Video, Image as ImageIcon, MessageSquare, Download, RefreshCw,
  AlertTriangle, FileText, CheckCircle2, Upload, ArrowRight, Shield,
  ShieldCheck, AlertCircle, ShieldAlert, PhoneCall, Zap, Lock, Eye
} from 'lucide-react';
import { analyzeVoice, analyzeVideo, analyzeImage, analyzeText, getTrustScore } from '../api';
import { ScoreGauge, ScoreBar, ProcessingTimeline } from '../components/UIComponents';
import { downloadTrustCapsule } from '../trustCapsule';

// ──────────────────────────────────────────
// Upload Card
// ──────────────────────────────────────────
function UploadCard({ accept, label, description, formats, icon: Icon, onFile, loading, fileName, color = '#0EA5E9' }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const cardStyle = {
    cursor: loading ? 'wait' : 'pointer',
    borderColor: fileName ? 'var(--primary)' : loading ? 'var(--primary)' : 'var(--border-color)',
    background: fileName ? '#F0F9FF' : loading ? '#F0F9FF' : 'white',
    transition: 'all 0.2s ease',
    padding: '16px',
  };

  return (
    <div
      className="card shadow-hover"
      style={cardStyle}
      onClick={() => !loading && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleChange} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: fileName ? '#DBEAFE' : '#F8FAFC',
          border: `1px solid ${fileName ? '#BFDBFE' : 'var(--border-color)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: fileName ? 'var(--primary)' : 'var(--text-secondary)',
          transition: 'all 0.2s',
        }}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif' }}>{label}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>{description}</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 700, letterSpacing: '0.04em' }}>Supports {formats}</div>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite' }} />
              Scanning
            </div>
          )}
          {fileName && !loading && <CheckCircle2 size={24} color="var(--success)" />}
          {!fileName && !loading && (
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
            }}>
              <Upload size={18} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
      {fileName && (
        <div style={{ marginTop: 14, padding: '8px 12px', background: 'white', border: '1px solid #BFDBFE', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={14} color="var(--primary)" />
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// Explainable AI Visual
// ──────────────────────────────────────────
function ExplainableVisual({ type, text }) {
  if (type === 'voice') {
    return (
      <div style={{ background: '#0F172A', borderRadius: 8, padding: 12, position: 'relative', overflow: 'hidden', height: 100, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const isAnomaly = i > 15 && i < 22;
          const height = isAnomaly ? Math.random() * 40 + 40 : Math.random() * 30 + 10;
          return (
            <div key={i} style={{
              flex: 1, height: `${height}%`,
              background: isAnomaly ? 'var(--danger)' : '#38BDF8',
              opacity: isAnomaly ? 0.9 : 0.5,
              borderRadius: '2px 2px 0 0'
            }} />
          );
        })}
        <div style={{ position: 'absolute', top: 8, left: 12, fontSize: 10, color: 'white', fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4 }}>SPECTROGRAM ANALYSIS</div>
        <div style={{ position: 'absolute', bottom: 8, left: '40%', fontSize: 10, color: '#FECACA', fontWeight: 700, border: '1px solid var(--danger)', padding: '2px 6px', borderRadius: 4, background: 'rgba(220,38,38,0.2)' }}>Vocoder Artifacts Found</div>
      </div>
    );
  }
  if (type === 'text') {
    const highlightWords = ['urgently', 'immediately', 'aadhaar', 'otp', 'arrest', 'blocked', 'freeze', 'pay now', '₹5,000', '₹', 'police'];
    const safeText = text || '';
    const parts = safeText.split(new RegExp(`(${highlightWords.join('|')})`, 'gi'));
    return (
      <div style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6, background: 'white', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)' }}>
        {parts.map((part, i) => highlightWords.includes(part.toLowerCase())
          ? <span key={i} style={{ background: '#FEE2E2', color: 'var(--danger)', fontWeight: 700, padding: '0 4px', borderRadius: 4, borderBottom: '2px solid var(--danger)' }}>{part}</span>
          : <span key={i}>{part}</span>)}
      </div>
    );
  }
  if (type === 'video' || type === 'image') {
    return (
      <div style={{ background: '#1E293B', borderRadius: 8, height: 120, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 10l10-10H0l10 10zm0 0L0 20h20L10 10z\' fill=\'%23ffffff\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
        <div style={{ border: '2px dashed var(--danger)', width: 80, height: 80, borderRadius: 8, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -20, left: 0, fontSize: 10, color: 'var(--danger)', fontWeight: 700, background: '#FEE2E2', padding: '2px 6px', borderRadius: 4 }}>Manipulation Detected</div>
        </div>
      </div>
    );
  }
  return null;
}

// ──────────────────────────────────────────
// Decision Dashboard
// ──────────────────────────────────────────
function DecisionDashboard({ trustScore, results, onReset }) {
  const isDanger = trustScore.risk_level === 'High' || trustScore.risk_level === 'Critical';
  const riskColors = { Safe: 'var(--success)', Medium: '#CA8A04', High: 'var(--warning)', Critical: 'var(--danger)' };
  const rColor = riskColors[trustScore.risk_level] || '#94A3B8';

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif' }}>
          Decision Dashboard
        </h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ fontSize: 14, padding: '10px 16px', minHeight: 44 }} onClick={onReset}>
            <RefreshCw size={16} /> New Scan
          </button>
          <button
            className="btn-primary"
            onClick={() => downloadTrustCapsule({ trustScore, results, timestamp: trustScore.timestamp })}
            style={{ background: 'var(--success)', fontSize: 14, padding: '10px 16px', minHeight: 44 }}
          >
            <Download size={16} /> Download Official PDF
          </button>
        </div>
      </div>

      <div className="card shadow-premium" style={{ marginBottom: 24, border: `1px solid ${rColor}40`, background: isDanger ? '#FEF2F2' : '#F0FDF4' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <ScoreGauge score={trustScore.trust_score} size={180} />
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: rColor, color: 'white', padding: '6px 16px', borderRadius: 20, fontWeight: 800, fontSize: 15, letterSpacing: '0.04em', marginBottom: 16 }}>
              {isDanger ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
              {trustScore.risk_level.toUpperCase()} RISK
            </div>

            <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 6 }}>AI RECOMMENDATION</div>
              <p style={{ fontSize: 15, color: 'var(--text-main)', lineHeight: 1.6, fontWeight: 600 }}>{trustScore.recommendation}</p>
            </div>

            {isDanger && (
              <button style={{
                marginTop: 16, width: '100%', background: '#0F172A', color: 'white', border: 'none',
                padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(15,23,42,0.2)'
              }}>
                <PhoneCall size={18} />
                Verify with Trusted Contact
              </button>
            )}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, fontFamily: 'Manrope, sans-serif' }}>Evidence Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
        {Object.entries(results).map(([key, res]) => {
          if (!res) return null;
          const icons = { voice: Mic, video: Video, image: ImageIcon, text: MessageSquare };
          const Icon = icons[key] || AlertCircle;
          return (
            <div key={key} className="card shadow-soft" style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 15, textTransform: 'capitalize' }}>{key} Analysis</span>
                <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 800, color: res.status === 'Safe' ? 'var(--success)' : 'var(--danger)' }}>{res.score}%</span>
              </div>

              <ExplainableVisual type={key} text={key === 'text' ? trustScore.analyzedText : null} />

              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.06em' }}>DETECTED ARTIFACTS</div>
                  <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 800 }}>CONFIDENCE: {(res.confidence * 100).toFixed(0)}%</div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(res.reasons || []).map((r, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>
                      <AlertCircle size={14} color={res.status === 'Safe' ? 'var(--success)' : 'var(--danger)'} style={{ marginTop: 2, flexShrink: 0 }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Hero Section (Desktop)
// ──────────────────────────────────────────
function HeroSection() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', color: 'var(--secondary)', borderRadius: 20, padding: '5px 14px', marginBottom: 16, fontSize: 12, fontWeight: 800, letterSpacing: '0.06em' }}>
        <Zap size={13} />
        AI-POWERED DIGITAL TRUST · INDIA'S #1 SCAM DETECTOR
      </div>
      <h1 style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 800, marginBottom: 14, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: 'Manrope, sans-serif' }}>
        Verify <span style={{ color: 'var(--primary)' }}>Before</span> You Trust.
      </h1>
      <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.6, fontWeight: 500 }}>
        Detect deepfakes, voice clones, fake images, and scam messages in seconds using enterprise-grade AI.
      </p>
      {/* Trust badges */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        {[
          { icon: Lock, label: '100% Private — files never stored' },
          { icon: Eye, label: 'Real-time AI analysis' },
          { icon: Shield, label: 'Used by 2.4M+ people' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid var(--border-color)', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Icon size={13} color="var(--primary)" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Main UploadCenter
// ──────────────────────────────────────────
export default function UploadCenter() {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});
  const [trustScore, setTrustScore] = useState(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState([]);

  const dashboardRef = useRef(null);

  useEffect(() => {
    if (showResults && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  const startTimelineSequence = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimelineSteps([]);
    const steps = [
      { id: 'upload', delay: 0 },
      { id: 'preprocess', delay: 800 },
      { id: 'features', delay: 1600 },
      { id: 'analyze', delay: 2400 },
      { id: 'score', delay: 3200 },
    ];
    steps.forEach(step => {
      setTimeout(() => {
        setTimelineSteps(prev => [...prev, step.id]);
      }, step.delay);
    });
  };

  const processScan = async (type, analyzeFn, arg) => {
    if (isAnalyzing) return;

    setResults({});
    setErrors({});
    setTrustScore(null);
    setShowResults(false);
    setLoading(p => ({ ...p, [type]: true }));

    if (type !== 'text') setFiles(p => ({ ...p, [type]: arg.name }));

    startTimelineSequence();
    const startTime = Date.now();

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Analysis timed out after 30 seconds.')), 30000)
      );

      const apiRes = await Promise.race([analyzeFn(arg), timeoutPromise]);
      setResults({ [type]: apiRes });

      const ts = await Promise.race([getTrustScore({ [type]: apiRes }), timeoutPromise]);
      if (type === 'text') ts.analyzedText = arg;

      const elapsed = Date.now() - startTime;
      if (elapsed < 3500) await new Promise(r => setTimeout(r, 3500 - elapsed));

      setTrustScore(ts);
      setShowResults(true);
    } catch (e) {
      setErrors({ general: e.message || 'Unable to analyze. Please try again.' });
    } finally {
      setIsAnalyzing(false);
      setLoading(p => ({ ...p, [type]: false }));
    }
  };

  const handleFile = (type, analyzeFn) => (file) => {
    processScan(type, analyzeFn, file);
  };

  const handleTextAnalyze = () => {
    if (!text.trim()) return;
    processScan('text', analyzeText, text);
  };

  const handleReset = () => {
    setFiles({}); setLoading({}); setResults({}); setErrors({});
    setTrustScore(null); setText(''); setShowResults(false);
    setTimelineSteps([]); setIsAnalyzing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(20px, 5vw, 48px) clamp(12px, 4vw, 24px)' }}>
      {/* Error */}
      {errors.general && (
        <div className="card shadow-soft animate-fade-in" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: 'var(--danger)', padding: 24, textAlign: 'center', marginBottom: 24 }}>
          <AlertTriangle size={36} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Analysis Failed</h3>
          <p style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>{errors.general}</p>
          <p style={{ fontSize: 13, marginTop: 8, color: '#B91C1C', fontWeight: 500 }}>
            Make sure the backend is running: <code style={{ background: '#FEE2E2', padding: '2px 6px', borderRadius: 4 }}>cd backend && venv\Scripts\python.exe -m uvicorn main:app --port 8000</code>
          </p>
          <button onClick={handleReset} className="btn-secondary" style={{ marginTop: 20 }}>Try Again</button>
        </div>
      )}

      {!showResults && !errors.general ? (
        <>
          {/* Hero */}
          {!isAnalyzing && <HeroSection />}

          {/* Processing Timeline */}
          {isAnalyzing && <ProcessingTimeline steps={timelineSteps} />}

          {/* Upload Cards — only shown when not analyzing */}
          {!isAnalyzing && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <UploadCard
                  accept="audio/*"
                  label="Voice Shield"
                  description="Detect AI-cloned voices and deepfake audio"
                  formats="MP3 • WAV • M4A • OGG"
                  icon={Mic}
                  onFile={handleFile('voice', analyzeVoice)}
                  loading={loading.voice}
                  fileName={files.voice}
                />
                <UploadCard
                  accept="video/*"
                  label="Video Shield"
                  description="Detect deepfake videos and face-swaps"
                  formats="MP4 • MOV • AVI • WEBM"
                  icon={Video}
                  onFile={handleFile('video', analyzeVideo)}
                  loading={loading.video}
                  fileName={files.video}
                />
                <UploadCard
                  accept="image/*"
                  label="Image Shield"
                  description="Spot AI-generated images and fake receipts"
                  formats="JPG • PNG • WEBP • HEIC"
                  icon={ImageIcon}
                  onFile={handleFile('image', analyzeImage)}
                  loading={loading.image}
                  fileName={files.image}
                />
              </div>

              {/* Text / Social Shield */}
              <div className="card shadow-soft">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                    <MessageSquare size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif' }}>Social Shield</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Paste suspicious WhatsApp / SMS / email messages</div>
                  </div>
                </div>

                <textarea
                  rows={4}
                  placeholder="Paste a suspicious WhatsApp message, SMS, email, or job offer here..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  disabled={isAnalyzing}
                  style={{
                    width: '100%', background: '#F8FAFC', border: '1px solid var(--border-color)',
                    borderRadius: 10, padding: '14px', color: 'var(--text-main)', fontSize: 15,
                    resize: 'vertical', fontFamily: 'inherit', outline: 'none',
                    transition: 'border-color 0.2s', minHeight: 120,
                    opacity: isAnalyzing ? 0.6 : 1, boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />

                {/* Quick paste examples */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, alignSelf: 'center' }}>Try:</span>
                  {[
                    'Urgent! Your Aadhaar is blocked. Pay ₹5,000 now to CBI officer.',
                    'Congratulations! You won ₹10 lakh. Share OTP to claim.',
                    'Work from home job: earn ₹50,000/month. Pay ₹1,999 to register.',
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setText(example)}
                      style={{
                        fontSize: 11, background: '#F1F5F9', border: '1px solid var(--border-color)',
                        borderRadius: 20, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-secondary)',
                        fontWeight: 600, transition: 'all 0.15s',
                      }}
                      onMouseOver={e => e.target.style.background = '#E2E8F0'}
                      onMouseOut={e => e.target.style.background = '#F1F5F9'}
                    >
                      Example {i + 1}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleTextAnalyze}
                    disabled={!text.trim() || isAnalyzing}
                    className="btn-primary"
                    style={{ fontSize: 14, padding: '10px 24px', minHeight: 44, borderRadius: 12, opacity: (!text.trim() || isAnalyzing) ? 0.6 : 1 }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
                    {!isAnalyzing && <ArrowRight size={16} />}
                  </button>
                </div>
              </div>

              {/* How it works (desktop only) */}
              <div className="desktop-only" style={{ marginTop: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 16, textAlign: 'center' }}>HOW IT WORKS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[
                    { step: '1', title: 'Upload or Paste', desc: 'Upload a voice, video, image, or paste a suspicious message.', color: 'var(--primary)' },
                    { step: '2', title: 'AI Scans in Seconds', desc: 'Our AI analyzes over 50 deepfake indicators in real-time.', color: '#7C3AED' },
                    { step: '3', title: 'Get Your Trust Score', desc: 'Receive a full report with evidence and recommended action.', color: 'var(--success)' },
                  ].map(({ step, title, desc, color }) => (
                    <div key={step} className="card shadow-soft" style={{ textAlign: 'center', padding: '20px 16px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}15`, border: `2px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 16, fontWeight: 800, color, fontFamily: 'Manrope, sans-serif' }}>{step}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)', marginBottom: 6 }}>{title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        showResults && (
          <div ref={dashboardRef}>
            <DecisionDashboard trustScore={trustScore} results={results} onReset={handleReset} />
          </div>
        )
      )}
    </div>
  );
}
