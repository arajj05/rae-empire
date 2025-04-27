// backend/deepHealingEngine.js

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// List of critical files Rae should monitor deeply
const criticalFiles = [
  './backend/server.js',
  './backend/selfRepairEngine.js',
  './backend/salesResponder.js',
  './backend/paymentMonitor.js'
];

// Common fix patterns Rae can auto-repair
const commonFixes = [
  {
    pattern: /(const\s+\{.*handleNewSale.*\}\s*=\s*require\('.*'\);)[\s\S]*?(const\s+\{.*handleNewSale.*\}\s*=\s*require\('.*'\);)/g,
    fix: (match) => {
      console.log('🛠 Rae: Duplicate import detected. Auto-fixing...');
      return match.split('\n')[0]; // Keep the first, remove the second
    }
  },
  {
    pattern: /SyntaxError:\s*Identifier\s*'.*'\s*has\s*already\s*been\s*declared/g,
    fix: () => {
      console.log('🛠 Rae: Syntax error detected. Attempting smart rebuild...');
      return '';
    }
  }
];

// Scan and auto-fix errors
function scanAndHealCode() {
  console.log('🩺 Rae: Starting deep code audit...');

  criticalFiles.forEach(file => {
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ File missing: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    commonFixes.forEach(({ pattern, fix }) => {
      const regex = new RegExp(pattern);
      if (regex.test(content)) {
        content = content.replace(regex, fix);
      }
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Rae auto-healed: ${file}`);
      restartServer();
    }
  });
}

// Restart Rae if auto-healed
function restartServer() {
  console.log('🔄 Rae: Restarting to apply healing...');
  exec('pm2 restart rae-server', (err) => {
    if (err) {
      console.error('❌ Rae Restart Error:', err.message);
    } else {
      console.log('🚀 Rae restarted with healed code.');
    }
  });
}

// Export the deep scan function
module.exports = {
  scanAndHealCode
};
