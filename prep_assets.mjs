import fs from 'fs';
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}
fs.copyFileSync('public/logo-512x512.png', 'assets/icon.png');
fs.copyFileSync('public/logo-512x512.png', 'assets/splash.png');
console.log('Done');
