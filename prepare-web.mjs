// Menyalin library PDF/Excel dan font ke www/vendor supaya aplikasi jalan offline.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const nm = (p) => path.join(root, 'node_modules', p);
const out = path.join(root, 'www', 'vendor');
const fontOut = path.join(out, 'fonts');
fs.mkdirSync(fontOut, { recursive: true });

function mustCopy(from, to) {
  if (!fs.existsSync(from)) throw new Error('File tidak ditemukan: ' + from);
  fs.copyFileSync(from, to);
  console.log('ok  ' + path.relative(root, to));
}

mustCopy(nm('jspdf/dist/jspdf.umd.min.js'), path.join(out, 'jspdf.umd.min.js'));
mustCopy(nm('xlsx/dist/xlsx.full.min.js'), path.join(out, 'xlsx.full.min.js'));

const families = [
  ['Baloo 2', '@fontsource/baloo-2', [500, 600, 700, 800]],
  ['Quicksand', '@fontsource/quicksand', [500, 600, 700]],
];
let css = '/* font lokal (latin) */\n';
for (const [name, pkg, weights] of families) {
  const base = pkg.split('/')[1];
  for (const w of weights) {
    const file = `${base}-latin-${w}-normal.woff2`;
    const src = nm(`${pkg}/files/${file}`);
    if (!fs.existsSync(src)) { console.warn('peringatan: font tidak ada, dilewati: ' + file); continue; }
    fs.copyFileSync(src, path.join(fontOut, file));
    css += `@font-face{font-family:'${name}';font-style:normal;font-weight:${w};font-display:swap;src:url(fonts/${file}) format('woff2');}\n`;
  }
}
fs.writeFileSync(path.join(out, 'fonts.css'), css);
console.log('ok  www/vendor/fonts.css');
