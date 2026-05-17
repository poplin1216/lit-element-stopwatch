import fs from 'fs';
import path from 'path';

function copyCssFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyCssFiles(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
}

copyCssFiles('components', 'dist/components');
