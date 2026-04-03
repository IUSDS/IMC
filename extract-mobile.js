const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const videoPath = 'public/video/bg-mobile.MP4';
const outDir = 'public/home/hero-frames-mobile';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Extracting frames with ffmpeg from:', ffmpeg);
try {
  execSync(`"${ffmpeg}" -i "${videoPath}" -qscale:v 2 "${outDir}/frame_%04d.jpg"`, { stdio: 'inherit' });
  console.log('Extraction complete!');
} catch (e) {
  console.error('Extraction failed:', e.message);
}
