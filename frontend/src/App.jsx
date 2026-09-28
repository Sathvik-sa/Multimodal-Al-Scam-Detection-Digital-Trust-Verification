import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, Home, Wifi, WifiOff, X, Download,
  BarChart2, Clock, Scan, Users
} from 'lucide-react';
import UploadCenter from './pages/UploadCenter';
import DemoPage from './pages/DemoPage';
import LiveDetection from './pages/LiveDetection';
import ReportsPage from './pages/ReportsPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import OnboardingPage from './pages/OnboardingPage';
import InstallPrompt from './components/InstallPrompt';

function useVisitorCount() {
  const [count] = useState(() => {
    try {
      const stored = localStorage.getItem('sg-visit-count');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  return count;
}

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  if (isOnline) return null;
  return (
    <div className="offline-banner">
      <WifiOff size={14} />
      Offline Mode — Cached content available
    </div>
  );
}

function DesktopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const visitors = useVisitorCount();

  return (
    <nav className="desktop-only" style={{
      background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 100, padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(14,165,233,0.25)' }}>
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'Manrope, sans-serif' }}>ShadowGuard AI</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}>Digital Trust Platform</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[
            { path: '/', label: 'Scan', icon: Scan },
            { path: '/live', label: 'Live', icon: Wifi },
            { path: '/demo', label: 'Demo', icon: BarChart2 },
            { path: '/reports', label: 'Reports', icon: BarChart2 },
            { path: '/analytics', label: 'Analytics', icon: Users },
            { path: '/history', label: 'History', icon: Clock },
          ].map(({ path, label, icon: Icon }) => (
            <button key={path} className={`nav-link ${isActive(path) ? 'active' : ''}`} onClick={() => navigate(path)}>
              <Icon size={14} strokeWidth={2.5} />{label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
            AI Ready
          </div>
          {visitors > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: 'var(--secondary)' }}>
              <Users size={12} />
              {visitors.toLocaleString()} visits
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const titles = { '/': 'Scan', '/live': 'Live Detection', '/demo': 'Demo', '/reports': 'Reports', '/analytics': 'Analytics', '/history': 'History', '/onboarding': 'Welcome' };
  const title = titles[location.pathname] || 'ShadowGuard';

  return (
    <div className="mobile-only" style={{
      background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: 56,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Shield size={16} strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)', fontFamily: 'Manrope, sans-serif' }}>{title}</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, background: '#F1F5F9', padding: '3px 10px', borderRadius: 20 }}>v2.0</div>
    </div>
  );
}

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  if (location.pathname === '/onboarding') return null;

  const items = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/live', icon: Wifi, label: 'Live' },
    { path: 'SCAN', icon: Scan, label: 'Scan', isScan: true },
    { path: '/demo', icon: BarChart2, label: 'Demo' },
    { path: '/analytics', icon: Users, label: 'Stats' },
  ];

  return (
    <nav className="bottom-nav mobile-only">
      {items.map(({ path, icon: Icon, label, isScan }) => {
        if (isScan) {
          return (
            <button key="scan" className="bottom-nav-item scan-btn" onClick={() => navigate('/')}>
              <Scan size={22} strokeWidth={2.5} />
              <span style={{ fontSize: 9 }}>Scan</span>
            </button>
          );
        }
        return (
          <button key={path} className={`bottom-nav-item ${isActive(path) ? 'active' : ''}`} onClick={() => navigate(path)}>
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="desktop-only" style={{ borderTop: '1px solid var(--border-color)', textAlign: 'center', padding: '24px 20px', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
      ShadowGuard AI © 2026 · Enterprise Digital Trust Platform ·{' '}
      <a href="/onboarding" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Mobile Setup Guide</a>
    </footer>
  );
}

function AppInner() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      const isMobile = window.innerWidth < 768;
      const done = localStorage.getItem('sg-onboarded');
      return isMobile && !done;
    } catch {
      return false;
    }
  });

  if (showOnboarding) return <OnboardingPage onDone={() => setShowOnboarding(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <OfflineBanner />
      <MobileHeader />
      <DesktopNavbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<UploadCenter />} />
          <Route path="/live" element={<LiveDetection />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/onboarding" element={<OnboardingPage onDone={() => setShowOnboarding(false)} />} />
          <Route path="*" element={<UploadCenter />} />
        </Routes>
      </main>
      <BottomNav />
      <Footer />
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
