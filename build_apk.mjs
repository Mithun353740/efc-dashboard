import { exec } from 'child_process';

const p = exec('./gradlew assembleDebug', { cwd: './android' }, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  if (stderr) console.error(`stderr: ${stderr}`);
});

p.stdout.pipe(process.stdout);
p.stderr.pipe(process.stderr);
