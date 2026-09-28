const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeVoice(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/voice`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Voice API failed');
  return res.json();
}

export async function analyzeVideo(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/video`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Video API failed');
  return res.json();
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/image`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Image API failed');
  return res.json();
}

export async function analyzeText(text) {
  const res = await fetch(`${API_BASE}/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Text API failed');
  return res.json();
}

export async function getTrustScore(results) {
  const payload = {
    voice: results.voice || null,
    video: results.video || null,
    image: results.image || null,
    text: results.text || null,
  };
  const res = await fetch(`${API_BASE}/trust-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results: payload }),
  });
  if (!res.ok) throw new Error('Trust Score API failed');
  return res.json();
}
