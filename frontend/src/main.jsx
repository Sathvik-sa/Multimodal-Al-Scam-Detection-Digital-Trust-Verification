import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error Boundary — prevents blank white screen on render crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ShadowGuard render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#F8FAFC', padding: '24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>
            ShadowGuard encountered an error
          </h2>
          <p style={{ fontSize: 14, color: '#475569', marginBottom: 24, maxWidth: 400 }}>
            {this.state.error?.message || 'Something went wrong. Please refresh to continue.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#0EA5E9', color: 'white', border: 'none',
              padding: '12px 28px', borderRadius: 10, fontWeight: 700,
              fontSize: 15, cursor: 'pointer'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Register Service Worker for PWA (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW failed:', err));
  });
}

// Lazy-load Vercel analytics only in production to avoid dev issues
const Analytics = import.meta.env.PROD
  ? React.lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })))
  : () => null;
const SpeedInsights = import.meta.env.PROD
  ? React.lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })))
  : () => null;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      {import.meta.env.PROD && (
        <React.Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
        </React.Suspense>
      )}
    </ErrorBoundary>
  </React.StrictMode>,
)
