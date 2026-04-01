const fs = require('fs');
const path = require('path');

const logoPath = 'C:\\Users\\Anwender\\.gemini\\antigravity\\brain\\401c05be-5573-4c4e-9dee-9ec91aa8830a\\media__1774773520479.png';
const publicSvgPath = 'public/favicon.svg';
const appSvgPath = 'src/app/icon.svg';

try {
  const logo = fs.readFileSync(logoPath);
  const b64 = logo.toString('base64');
  const svg = `<svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${b64}" width="200" height="120" />
</svg>`;
  
  fs.writeFileSync(publicSvgPath, svg);
  fs.writeFileSync(appSvgPath, svg);
  console.log('Successfully created embedded SVG icons.');
} catch (error) {
  console.error('Error creating icons:', error);
}
