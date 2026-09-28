import React, { useState } from 'react';
import { Clock, Download, Trash2, Search, Filter, Shield, Mic, Video, Image as ImageIcon, MessageSquare, ChevronRight } from 'lucide-react';
import { downloadTrustCapsule } from '../trustCapsule';

// ──────────────────────────────────────────
// Mock history data
// ──────────────────────────────────────────
const MOCK_HISTORY = [
  {
    id: 1,
    type: 'voice',
    title: 'Voice Recording — family_call.wav',
    timestamp: '25 Sep 2026, 03:45 PM',
    score: 18,
    status: 'Fake',
    risk: 'Critical',
    reasons: ['AI vocoder artifacts detected', 'Synthetic harmonics in 200–400 Hz'],
    confidence: 0.96,
  },
  {
    id: 2,
    type: 'text',
    title: 'WhatsApp Message — Digital Arrest',
    timestamp: '25 Sep 2026, 02:12 PM',
    score: 8,
    status: 'Fake',
    risk: 'Critical',
    reasons: ['Digital arrest scam pattern', 'Urgency + financial demand'],
    confidence: 0.97,
  },
  {
    id: 3,
    type: 'image',
    title: 'Payment Screenshot — paytm.png',
    timestamp: '25 Sep 2026, 01:20 PM',
    score: 22,
    status: 'Fake',
    risk: 'High',
    reasons: ['Font inconsistency detected', 'EXIF metadata missing'],
    confidence: 0.92,
  },
  {
    id: 4,
    type: 'voice',
    title: 'Office voice memo — meeting.mp3',
    timestamp: '24 Sep 2026, 11:30 AM',
    score: 91,
    status: 'Safe',
    risk: 'Safe',
    reasons: ['Natural breathing patterns', 'Consistent audio spectrum'],
    confidence: 0.95,
  },
  {
    id: 5,
    type: 'text',
    title: 'Appointment reminder message',
    timestamp: '24 Sep 2026, 09:15 AM',
    score: 88,
    status: 'Safe',
    risk: 'Safe',
    reasons: ['No urgency language', 'Verifiable contact provided'],
    confidence: 0.91,
  },
  {
    id: 6,
    type: 'video',
    title: 'Investment video — politician.mp4',
    timestamp: '23 Sep 2026, 08:00 PM',
    score: 19,
    status: 'Fake',
    risk: 'Critical',
    reasons: ['Lip-sync mismatch', 'Facial boundary artifacts'],
    confidence: 0.94,
  },
];

const TYPE_ICONS = { voice: Mic, video: Video, image: ImageIcon, text: MessageSquare };
const RISK_COLORS = { Safe: 'var(--success)', Medium: '#CA8A04', High: 'var(--warning)', Critical: 'var(--danger)' };

function HistoryCard({ item, onDelete }) {
  const Icon = TYPE_ICONS[item.type] || Shield;
  const riskColor = RISK_COLORS[item.risk] || '#94A3B8';
  const isGood = item.status === 'Safe';

  const handleDownload = () => {
    const fakeResult = { [item.type]: { score: item.score, status: item.status, confidence: item.confidence, reasons: item.reasons } };
    const ts = {
      trust_score: item.score,
      risk_level: item.risk,
      recommendation: isGood ? 'Content verified as authentic.' : 'Suspicious content detected. Do not act on it.',
      timestamp: item.timestamp,
    };
    downloadTrustCapsule({ trustScore: ts, results: fakeResult, timestamp: item.timestamp });
  };

  return (
    <div className="card shadow-soft" style={{ marginBottom: 12, borderLeft: `4px solid ${riskColor}`, borderRadius: '0 12px 12px 0', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: isGood ? '#F0FDF4' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: riskColor, flexShrink: 0 }}>
          <Icon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={11} />
            {item.timestamp}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: riskColor, fontFamily: 'Manrope, sans-serif' }}>{item.score}</span>
            <span style={{ fontSize: 11, color: riskColor, fontWeight: 700, background: `${riskColor}14`, padding: '2px 8px', borderRadius: 20 }}>{item.risk}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleDownload}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-color)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }}
            title="Download PDF"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--danger)', transition: 'all 0.15s' }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// History Page
// ──────────────────────────────────────────
export default function HistoryPage() {
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleDelete = (id) => setHistory(prev => prev.filter(h => h.id !== id));

  const filtered = history.filter(h => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || h.risk.toLowerCase() === filter.toLowerCase() || h.type === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: history.length,
    critical: history.filter(h => h.risk === 'Critical').length,
    safe: history.filter(h => h.risk === 'Safe').length,
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px) clamp(12px, 4vw, 20px)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif' }}>
          Scan History
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Your recent verifications. All data auto-deleted after 24 hours.
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Scans', value: stats.total, color: 'var(--primary)' },
          { label: 'Threats Found', value: stats.critical, color: 'var(--danger)' },
          { label: 'Safe', value: stats.safe, color: 'var(--success)' },
        ].map(s => (
          <div key={s.label} className="card shadow-soft" style={{ textAlign: 'center', padding: '14px 10px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Manrope, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              border: '1px solid var(--border-color)', borderRadius: 10,
              fontSize: 14, color: 'var(--text-main)', background: 'white',
              outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 14, color: 'var(--text-main)', background: 'white', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">All</option>
          <option value="critical">Critical</option>
          <option value="safe">Safe</option>
          <option value="voice">Voice</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="text">Text</option>
        </select>
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)' }}>
          <Clock size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 15, fontWeight: 600 }}>No results found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try a different search or filter</div>
        </div>
      ) : (
        filtered.map(item => <HistoryCard key={item.id} item={item} onDelete={handleDelete} />)
      )}
    </div>
  );
}
