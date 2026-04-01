const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We skip Navbar because we hand-fixed it previously
      if (fullPath.includes('Navbar.tsx')) continue;

      let modified = false;

      const newColor = 'color: var(--foreground)';
      const newSecColor = 'color: var(--text-secondary)';
      
      const before = content;
      
      // Basic white replacement
      content = content.replace(/color:\s*white;?/gi, newColor + ';');
      content = content.replace(/color:\s*['"]white['"]/gi, "color: 'var(--foreground)'");
      content = content.replace(/color:\s*['"]#fff(?:fff)?['"]/gi, "color: 'var(--foreground)'");
      content = content.replace(/color:\s*#fff(?:fff)?;?/gi, newColor + ';');
      
      // RGBA text replacements
      content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.[5-9]\);?/g, newSecColor + ';');
      content = content.replace(/color:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.[5-9]\)['"]/g, "color: 'var(--text-secondary)'");
      
      // Border replacements
      content = content.replace(/border(-[a-z]+)?:\s*1px\s+solid\s+rgba\(255,\s*255,\s*255,\s*0\.\d+\);?/g, 'border$1: 1px solid var(--card-border);');
      
      // Specific UI edge cases (buttons should be white)
      content = content.replace(/background:\s*#c00000;[\s\S]*?color:\s*var\(--foreground\)/g, match => match.replace('var(--foreground)', '#ffffff'));
      
      if (before !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'src'));
