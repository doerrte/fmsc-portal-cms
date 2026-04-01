const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf-8');

    if (!content.includes('getDbData') && !content.includes('saveDbData')) {
        return;
    }

    let newContent = content;

    // Replace getDbData() with await getDbData() if not preceded by await
    newContent = newContent.replace(/(?<!await\s)getDbData\(\)/g, 'await getDbData()');
    
    // Replace saveDbData( with await saveDbData( if not preceded by await
    newContent = newContent.replace(/(?<!await\s)saveDbData\(/g, 'await saveDbData(');

    let lines = newContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes('function') && !line.includes('async ') && (line.includes('Page') || line.includes('GET') || line.includes('PUT') || line.includes('POST') || !line.includes('Client'))) {
            if (line.includes('export default function') || line.includes('export function')) {
                lines[i] = line.replace('function', 'async function');
            }
        }
    }

    newContent = lines.join('\n');

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf-8');
        console.log(`Updated ${filepath}`);
    }
}

function walkArgs(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkArgs(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            if (!fullPath.includes('db.ts')) {
                processFile(fullPath);
            }
        }
    });
}

walkArgs('src');
