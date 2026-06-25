const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const configuredBasePath = process.env.PAGES_BASE_PATH || '/archivory-mobile';
const basePath = configuredBasePath.endsWith('/')
  ? configuredBasePath.slice(0, -1)
  : configuredBasePath;

const textExtensions = new Set([
  '.html',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.map',
]);

function walkFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function patchFile(filePath) {
  const ext = path.extname(filePath);
  if (!textExtensions.has(ext)) {
    return false;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const patched = original
    .replaceAll('"/_expo/', `"${basePath}/_expo/`)
    .replaceAll("'/_expo/", `'${basePath}/_expo/`)
    .replaceAll('(/_expo/', `(${basePath}/_expo/`)
    .replaceAll('=/_expo/', `=${basePath}/_expo/`);

  if (patched !== original) {
    fs.writeFileSync(filePath, patched, 'utf8');
    return true;
  }

  return false;
}

if (!fs.existsSync(distDir)) {
  console.error('dist folder not found. Run expo export first.');
  process.exit(1);
}

const files = walkFiles(distDir);
let changedCount = 0;

for (const file of files) {
  if (patchFile(file)) {
    changedCount += 1;
  }
}

console.log(`Patched ${changedCount} file(s) for GitHub Pages base path: ${basePath}`);
