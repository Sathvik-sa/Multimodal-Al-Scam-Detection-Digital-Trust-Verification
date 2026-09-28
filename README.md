# ShadowGuard AI v2.0

> **AI-Powered Digital Trust Platform** — Detect deepfakes, voice clones, scam messages and fake videos in real-time.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PWA](https://img.shields.io/badge/PWA-Mobile--First-0EA5E9)](https://web.dev/pwa)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

##  What ShadowGuard Does

| Module | What it detects |
|--------|----------------|
|  **Voice Shield** | AI-cloned voices, synthetic speech, vocoder artifacts |
|  **Video Shield** | Deepfake videos, lip-sync mismatches, face-swap artifacts |
|  **Image Shield** | AI-generated faces, edited payment screenshots, fake receipts |
|  **Social Shield** | Scam messages, WhatsApp fraud, fake job offers, digital arrest scams |
|  **Live Voice** | Real-time microphone voice analysis every 3 seconds |
|  **Live Camera** | Real-time webcam deepfake detection every 2.5 seconds |

---

##  Mobile-First PWA

ShadowGuard AI is a full **Progressive Web App** — installable directly from Chrome without any App Store:

```
1. Open https://shadowguard.vercel.app on Android/iPhone
2. Tap ⋮ → "Add to Home Screen"
3. Launch like a native app — no browser bar!
```

**Supports:** Samsung · OnePlus · Pixel · iPhone (iOS 16.4+)

---

## Architecture

```
shadowguard/
├── frontend/                    # React 19 + Vite + TailwindCSS
│   ├── public/
│   │   ├── manifest.json        # PWA manifest
│   │   ├── sw.js                # Service Worker (offline support)
│   │   └── icons/               # App icons (72–512px)
│   └── src/
│       ├── pages/
│       │   ├── UploadCenter.jsx  # Main scan page
│       │   ├── LiveDetection.jsx # Real-time voice + camera
│       │   ├── DemoPage.jsx      # One-click demo scenarios
│       │   ├── ReportsPage.jsx   # Scam intelligence dashboard
│       │   └── HistoryPage.jsx   # Scan history
│       ├── components/
│       │   ├── UIComponents.jsx  # Score gauge, badges, timeline
│       │   └── InstallPrompt.jsx # PWA install banner
│       ├── api.js                # Backend API client
│       └── trustCapsule.js      # PDF report generator
│
├── backend/                     # FastAPI + Python
│   ├── main.py                  # API routes
│   ├── ml_engine.py             # AI models (DistilBERT, MediaPipe, OpenCV)
│   └── requirements.txt
│
└── demo_assets/                 # Pre-built demo files
    ├── digital_arrest_sample.txt
    ├── kyc_scam_sample.txt
    ├── fake_job_sample.txt
    └── whatsapp_emergency_sample.txt
```

---

## Tech Stack

### Frontend
- **React 19** + **Vite 8** + **TailwindCSS 4**
- **Lucide React** icons (zero emojis)
- **jsPDF** for Trust Capsule PDF generation
- **react-router-dom v7** for navigation
- **VitePWA** plugin for service worker + manifest
- **framer-motion** for animations

### Backend
- **FastAPI** (async Python)
- **DistilBERT** (zero-shot text classification)
- **MediaPipe** (face detection)
- **OpenCV** (image/video processing)
- **Wav2Vec2** (voice analysis, heuristic fallback)

### Infrastructure
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

---

##  Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Clone
```bash
git clone https://github.com/yourusername/shadowguard.git
cd shadowguard
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

### 3. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```
API: http://localhost:8000
Docs: http://localhost:8000/docs

### 4. Configure Environment
```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```

---

##  Running the Demo

1. Start both servers (frontend + backend)
2. Open http://localhost:5173
3. Go to **Live Demo** tab
4. Click any scenario card (e.g., "Digital Arrest Scam")
5. Watch AI analysis run in real-time
6. Download Trust Capsule PDF

---

##  API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/voice` | POST | Analyze audio file for AI cloning |
| `/video` | POST | Analyze video for deepfake artifacts |
| `/image` | POST | Analyze image for AI generation |
| `/text` | POST | Analyze text for scam patterns |
| `/trust-score` | POST | Calculate combined trust score |
| `/health` | GET | Backend health check |

### Example: Analyze Text
```bash
curl -X POST http://localhost:8000/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Urgent! Your account is blocked. Send OTP now!"}'
```

### Example Response
```json
{
  "score": 12,
  "status": "Fake",
  "confidence": 0.97,
  "reasons": [
    "Digital Arrest scam pattern detected",
    "Urgency keywords: immediately, blocked",
    "Financial demand detected"
  ]
}
```

---

##  Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

Set environment variable in Vercel:
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend → Render
1. Connect GitHub repo to Render
2. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Set Build Command: `pip install -r requirements.txt`

### PWA Install (Production)
After deployment, the app is automatically installable on:
- **Android Chrome:** Three-dot menu → "Add to Home Screen"
- **iPhone Safari:** Share → "Add to Home Screen"

---

##  Mobile Demo Flow (Hackathon)

```
1. Open deployed URL on Samsung phone
2. Chrome shows "Add to Home Screen" banner → Tap Install
3. Launch ShadowGuard from home screen (full-screen, no browser bar)
4. Bottom tab: Tap "Live" → Start Live Voice Scan
5. Speak into microphone → Watch Trust Score update every 3 seconds
6. Switch to Camera tab → Point at face/video
7. Watch real-time deepfake detection
8. Go to "Scan" → Paste scam message → Analyze
9. Tap "Download PDF" → Trust Capsule saved to device
10. Open QR code from PDF for verification
```

---

## Security Features

- * JWT-ready authentication layer
- * File size limits (50MB max)
- * File type validation
- * CORS configuration
- * Auto-delete uploads after 24 hours
- * No permanent storage of recordings
- * Camera/microphone permission handling
- * HTTPS-ready deployment

---

##  Roadmap

- [ ] WhatsApp Web integration
- [ ] Browser extension
- [ ] Real-time phone call analysis
- [ ] Multi-language scam detection (Hindi, Tamil, Telugu)
- [ ] Government API integration (RBI, TRAI)
- [ ] Batch analysis for enterprises
- [ ] Mobile app (React Native)

---

##  License

MIT License — Built for cybersecurity research and education.

---

**ShadowGuard AI** — *Verify Before You Trust.* 
