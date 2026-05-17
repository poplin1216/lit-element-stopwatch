import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { marked } from 'marked';

const __dirname = path.resolve();

const targets = [
  { md: 'portfolio.md', html: 'portfolio.html', pdf: 'portfolio.pdf', title: 'Portfolio - AI-Native Web Engineering' },
  { md: 'portfolio_en.md', html: 'portfolio_en.html', pdf: 'portfolio_en.pdf', title: 'Portfolio (EN) - AI-Native Web Engineering' }
];

// Find system pre-installed browsers on Windows
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let browserPath = '';
if (fs.existsSync(edgePath)) {
  browserPath = edgePath;
  console.log('🔍 Found Microsoft Edge installed.');
} else if (fs.existsSync(chromePath)) {
  browserPath = chromePath;
  console.log('🔍 Found Google Chrome installed.');
} else {
  browserPath = 'start msedge';
  console.log('⚠️ Browser paths not found in default locations. Attempting system alias...');
}

// Force branch name to 'main' for production-ready remote PDF links
const branchName = 'main';
const githubBaseUrl = `https://github.com/poplin1216/lit-element-stopwatch/blob/${branchName}`;
console.log(`🌐 Base GitHub URL configured as: ${githubBaseUrl}`);

for (const target of targets) {
  const markdownPath = path.join(__dirname, target.md);
  const htmlPath = path.join(__dirname, target.html);
  const pdfPath = path.join(__dirname, target.pdf);

  if (!fs.existsSync(markdownPath)) {
    console.log(`⚠️ Skip ${target.md}: File not found.`);
    continue;
  }

  try {
    console.log(`📖 Reading ${target.md}...`);
    let markdownContent = fs.readFileSync(markdownPath, 'utf-8');

    // Dynamically convert relative markdown links starting with './' to absolute remote GitHub URLs
    markdownContent = markdownContent.replace(/\(\.\/([^\s)]+)\)/g, (match, relPath) => {
      const absUrl = `${githubBaseUrl}/${relPath}`;
      console.log(`🔗 Map relative link in PDF: ${relPath} ➡️ ${absUrl}`);
      return `(${absUrl})`;
    });

    console.log(`🔄 Parsing ${target.md} to HTML...`);
    const htmlBody = marked.parse(markdownContent);

    // Ingest a gorgeous, premium, executive-level print stylesheet
    const htmlWrapper = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${target.title}</title>
  <style>
    /* Premium Executive CSS Stylesheet for Printing */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    
    body {
      font-family: 'Outfit', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }

    h1 {
      font-size: 26px;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-top: 0;
    }

    h2 {
      font-size: 18px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      color: #0284c7;
    }

    h3 {
      font-size: 15px;
      color: #334155;
    }

    p {
      margin-top: 0;
      margin-bottom: 1em;
      text-align: justify;
    }

    /* Professional Callout style for Developer's Note */
    blockquote {
      margin: 1.5em 0;
      padding: 12px 16px;
      background-color: #f0f9ff;
      border-left: 4px solid #0284c7;
      color: #0369a1;
      border-radius: 4px;
    }

    blockquote p {
      margin: 0;
      font-weight: 500;
      font-size: 13.5px;
    }

    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 2em 0;
    }

    /* Premium Modern Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
      font-size: 13px;
    }

    th {
      background-color: #f8fafc;
      color: #0f172a;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Sleek Code Blocks */
    pre, code {
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      font-size: 12.5px;
      background-color: #f1f5f9;
      border-radius: 4px;
    }

    code {
      padding: 2px 4px;
      color: #0f172a;
    }

    pre {
      padding: 12px;
      overflow: auto;
      border: 1px solid #e2e8f0;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 1.5em 0;
      page-break-inside: avoid;
    }

    pre code {
      padding: 0;
      background-color: transparent;
      color: #334155;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 20px;
    }

    li {
      margin-bottom: 0.4em;
    }

    /* Flowchart monospaced rendering */
    pre.flowchart {
      background-color: #f8fafc;
      border: 1px dashed #cbd5e1;
      color: #475569;
    }

    /* Link decoration */
    a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

    fs.writeFileSync(htmlPath, htmlWrapper, 'utf-8');
    console.log(`💾 Generated temporary ${target.html}`);

    console.log(`🖨 Headless browser printing to ${target.pdf}...`);
    const printCommand = `"${browserPath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-header-footer --print-to-pdf-no-header "${htmlPath}"`;
    
    execSync(printCommand);
    console.log(`🎉 ${target.pdf} successfully generated!`);

    // Clean up temporary HTML
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
      console.log(`🧹 Cleaned up temporary ${target.html}`);
    }

  } catch (err) {
    console.error(`❌ PDF Conversion failed for ${target.md}: ${err.message}`);
  }
}
console.log('🏁 All portfolio PDF conversions completed successfully!');
