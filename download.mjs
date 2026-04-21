import fs from 'fs';
import https from 'https';

https.get('https://raw.githubusercontent.com/Mithun353740/efc-dashboard/main/public/quantum_vortex_fc.jpg', (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('public/quantum_vortex_fc.jpg');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded');
    });
  } else {
    console.error('Failed to download: ' + res.statusCode);
  }
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
