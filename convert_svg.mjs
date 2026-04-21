import sharp from 'sharp';

async function convert() {
  try {
    await sharp('public/logo.svg')
      .resize(192, 192)
      .png()
      .toFile('public/logo-192x192.png');
    
    await sharp('public/logo.svg')
      .resize(512, 512)
      .png()
      .toFile('public/logo-512x512.png');
    
    console.log('Converted SVG to PNGs successfully');
  } catch (err) {
    console.error('Error:', err);
  }
}

convert();
