import React from 'react';
import { BarChart2, Map, TrendingUp, AlertTriangle, Shield, Users, Phone, CreditCard, Briefcase, Smartphone } from 'lucide-react';

const SCAM_CATEGORIES = [
  { label: 'Digital Arrest Scam', pct: 34, color: '#DC2626', icon: Shield },
  { label: 'KYC/Aadhaar Fraud', pct: 22, color: '#EA580C', icon: CreditCard },
  { label: 'Voice Clone Scam', pct: 18, color: '#0EA5E9', icon: Phone },
  { label: 'Fake Job Offer', pct: 14, color: '#7C3AED', icon: Briefcase },
  { label: 'Investment Fraud', pct: 8, color: '#CA8A04', icon: TrendingUp },
  { label: 'Other', pct: 4, color: '#94A3B8', icon: AlertTriangle },
];

const WEEKLY_TRENDS = [
  { day: 'Mon', reports: 1240 }, { day: 'Tue', reports: 1890 },
  { day: 'Wed', reports: 2310 }, { day: 'Thu', reports: 1780 },
  { day: 'Fri', reports: 2450 }, { day: 'Sat', reports: 3200 },
  { day: 'Sun', reports: 2890 },
];

const INDIA_HOTSPOTS = [
  { city: 'Mumbai', count: 4821, risk: 'Critical' }, { city: 'Delhi', count: 4102, risk: 'Critical' },
  { city: 'Bangalore', count: 3456, risk: 'High' }, { city: 'Hyderabad', count: 2891, risk: 'High' },
  { city: 'Chennai', count: 2340, risk: 'High' }, { city: 'Kolkata', count: 1987, risk: 'Medium' },
  { city: 'Pune', count: 1654, risk: 'Medium' }, { city: 'Ahmedabad', count: 1432, risk: 'Medium' },
];

const STAT_CARDS = [
  { label: 'Scams Detected Today', value: '12,847', change: '+8.2%', icon: AlertTriangle, color: 'var(--danger)' },
  { label: 'Voice Clones Flagged', value: '3,291', change: '+12.4%', icon: Phone, color: 'var(--primary)' },
  { label: 'Deepfakes Blocked', value: '891', change: '+6.1%', icon: Shield, color: 'var(--secondary)' },
  { label: 'Users Protected', value: '2.4M', change: '+22%', icon: Users, color: 'var(--success)' },
];

function StatCard({ label, value, change, icon: Icon, color }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="card shadow-soft" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 3 }}>{label}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: isPositive ? 'var(--danger)' : 'var(--success)', marginTop: 4 }}>{change} today</div>
      </div>
    </div>
  );
}

function CategoryBar({ label, pct, color, icon: Icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={14} color={color} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill animate-fade-in" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function TrendChart() {
  const max = Math.max(...WEEKLY_TRENDS.map(d => d.reports));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, padding: '0 4px' }}>
      {WEEKLY_TRENDS.map(({ day, reports }) => (
        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: `linear-gradient(to top, var(--primary), #38BDF8)`, height: `${(reports / max) * 80}px`, transition: 'height 0.6s ease', minHeight: 4 }} />
          <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{day}</span>
        </div>
      ))}
    </div>
  );
}

function HotspotRow({ city, count, risk }) {
  const riskColors = { Critical: 'var(--danger)', High: 'var(--warning)', Medium: '#CA8A04' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Map size={14} color="var(--text-secondary)" />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{city}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{count.toLocaleString()}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: riskColors[risk], background: `${riskColors[risk]}14`, padding: '2px 8px', borderRadius: 20 }}>{risk}</span>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px) clamp(12px, 4vw, 24px)' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0FDF4', color: 'var(--success)', borderRadius: 20, padding: '5px 14px', marginBottom: 12, fontSize: 12, fontWeight: 800, letterSpacing: '0.04em' }}>
          <BarChart2 size={13} /> SCAM INTELLIGENCE DASHBOARD
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif' }}>
          India Threat Intelligence
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
          Live threat analytics powered by community reports and AI detection.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 12, marginBottom: 24 }}>
        {STAT_CARDS.map(card => <StatCard key={card.label} {...card} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20, marginBottom: 20 }}>
        <div className="card shadow-soft">
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 16 }}>SCAM CATEGORY DISTRIBUTION</div>
          {SCAM_CATEGORIES.map(cat => <CategoryBar key={cat.label} {...cat} />)}
        </div>
        <div className="card shadow-soft">
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 8 }}>WEEKLY REPORT TRENDS</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 20, fontWeight: 500 }}>Total reports this week: {WEEKLY_TRENDS.reduce((a, b) => a + b.reports, 0).toLocaleString()}</div>
          <TrendChart />
          <div style={{ marginTop: 24, padding: '14px', background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--danger)', marginBottom: 4 }}>Most Common Today</div>
            <div style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 500 }}>Digital Arrest scams targeting elderly population in Mumbai and Delhi NCR</div>
          </div>
        </div>
      </div>

      <div className="card shadow-soft">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Map size={18} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif' }}>India Scam Hotspots</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Cities with highest scam activity</div>
          </div>
        </div>
        {INDIA_HOTSPOTS.map(spot => <HotspotRow key={spot.city} {...spot} />)}
      </div>
    </div>
  );
}
