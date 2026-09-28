// Generate PWA icons using Node canvas (run this script to create PNG icons)
// Usage: node scripts/generate-icons.mjs
// Requires: npm install canvas

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

mkdirSync('public/icons', { recursive: true });
mkdirSync('public/screenshots', { recursive: true });

function drawShieldIcon(canvas, size) {
  const ctx = canvas.getContext('2d');
  const padding = size * 0.1;
  const w = size - padding * 2;
  const h = size - padding * 2;
  const x = padding;
  const y = padding;

  // Background
  ctx.fillStyle = '#0EA5E9';
  roundRect(ctx, 0, 0, size, size, size * 0.18);
  ctx.fill();

  // Shield shape
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.moveTo(size / 2, y);
  ctx.bezierCurveTo(x + w * 0.2, y, x, y + h * 0.15, x, y + h * 0.4);
  ctx.bezierCurveTo(x, y + h * 0.75, size / 2, y + h, size / 2, y + h);
  ctx.bezierCurveTo(size / 2, y + h, x + w, y + h * 0.75, x + w, y + h * 0.4);
  ctx.bezierCurveTo(x + w, y + h * 0.15, x + w * 0.8, y, size / 2, y);
  ctx.closePath();
  ctx.fill();

  // Checkmark
  const cx = size / 2;
  const cy = y + h * 0.52;
  const lineW = size * 0.07;
  ctx.strokeStyle = '#0EA5E9';
  ctx.lineWidth = lineW;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - h * 0.18, cy);
  ctx.lineTo(cx - h * 0.04, cy + h * 0.15);
  ctx.lineTo(cx + h * 0.2, cy - h * 0.15);
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  drawShieldIcon(canvas, size);
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`public/icons/icon-${size}x${size}.png`, buffer);
  console.log(`Created icon-${size}x${size}.png`);
});

console.log('All icons generated!');
