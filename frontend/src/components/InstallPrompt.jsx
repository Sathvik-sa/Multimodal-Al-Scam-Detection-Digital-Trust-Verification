import React, { useState, useEffect } from 'react';
import { Shield, X, Download } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (localStorage.getItem('sg-install-dismissed')) return;

    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone;
    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setTimeout(() => setShow(true), 3000);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      alert("To install on iOS: tap the Share icon at the bottom of the screen, then select 'Add to Home Screen'.");
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('sg-install-dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="install-prompt">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
          boxShadow: '0 4px 14px rgba(14,165,233,0.3)'
        }}>
          <Shield size={24} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)', marginBottom: 2, fontFamily: 'Manrope, sans-serif' }}>
            Install ShadowGuard AI
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {isIOS ? 'Tap Share ⍐ and "Add to Home Screen" to install.' : 'Add to Home Screen for the full app experience'}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn-primary" style={{ flex: 1, fontSize: 14, padding: '10px 16px' }} onClick={handleInstall}>
              <Download size={15} />
              Install App
            </button>
            <button className="btn-secondary" style={{ fontSize: 14, padding: '10px 16px' }} onClick={handleDismiss}>
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4, flexShrink: 0 }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
