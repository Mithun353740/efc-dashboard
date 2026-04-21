import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

async function convertImage(size) {
  const image = await loadImage('public/logo.jpg');
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw with scaling
  ctx.drawImage(image, 0, 0, size, size);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/logo-${size}x${size}.png`, buffer);
  console.log(`Created logo-${size}x${size}.png`);
}

async function run() {
  try {
    await convertImage(192);
    await convertImage(512);
  } catch (error) {
    console.error('Failed using canvas, fallback to just reading/writing if possible, or print error:', error);
  }
}

run();
