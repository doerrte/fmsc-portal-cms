import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'getDbData' not in content and 'saveDbData' not in content:
        return

    new_content = content

    new_content = re.sub(r'(?<!await\s)getDbData\(\)', 'await getDbData()', new_content)
    new_content = re.sub(r'(?<!await\s)saveDbData\(', 'await saveDbData(', new_content)

    lines = new_content.split('\n')
    for i, line in enumerate(lines):
        if 'function' in line and not 'async ' in line and ('Page' in line or 'GET' in line or 'PUT' in line or 'POST' in line or 'Client' not in line):
            if 'export default function' in line or 'export function' in line:
                lines[i] = line.replace('function', 'async function')
        # Also fix any "export async function saveX(formData: FormData)" where getDbData inside wasn't awaited, but they already had async.

    new_content = '\n'.join(lines)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.ts', '.tsx')) and 'db.ts' not in file:
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
