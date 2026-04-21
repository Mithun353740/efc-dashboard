import fs from 'fs';
import https from 'https';

const url = 'https://raw.githubusercontent.com/Mithun353740/efc-dashboard/main/public/quantum_vortex_fc.jpg';

https.get(url, (res) => {
  const file = fs.createWriteStream('public/logo.jpg');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded logo.jpg');
    
    // Check size
    const stats = fs.statSync('public/logo.jpg');
    console.log(`Size: ${stats.size} bytes`);
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
