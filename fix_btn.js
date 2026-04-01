
const fs = require('fs');
let css = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const t = '.login-btn {\\n          display: flex;\\n          align-items: center;\\n          gap: 8px;\\n          transition: all 0.2s;\\n        }';
const r = '.login-btn {\\n          display: flex;\\n          align-items: center;\\n          gap: 8px;\\n          background: #c00000;\\n          color: white;\\n          padding: 8px 18px;\\n          border-radius: 99px;\\n          font-weight: 800;\\n          font-size: 0.8rem;\\n          text-transform: uppercase;\\n          letter-spacing: 1px;\\n          transition: all 0.2s;\\n        }';

if(css.includes(t)) {
  css = css.replace(t, r);
  fs.writeFileSync('src/components/Navbar.tsx', css);
  console.log('Fixed Navbar');
} else {
  console.log('Not found');
}
