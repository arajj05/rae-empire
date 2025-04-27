// backend/selfRepairEngine.js

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Files Rae watches
const filesToMonitor = [
  './server.js',
  './backend/selfHeal.js',
  './backend/wealthBuilder.js',
  './backend/emotionalGuardian.js',
  './backend/divineSeeker.js',
  './backend/whisperSystem.js',
  './backend/autoUpgrade.js',
  './backend/secureVault.js',
  './backend/portManager.js',
  './backend/sessionScanner.js'
];

// 🔧 Templates Rae uses if file missing
const missingFileTemplates = {
  './backend/whisperSystem.js': `
    const express = require('express');
    const router = express.Router();

    router.get('/whisper-status', (req, res) => {
      console.log('📢 Rae is sending a Whisper status update...');
      res.status(200).json({ message: 'Whisper: All Systems Optimal.' });
    });

    router.get('/activate', (req, res) => {
      console.log('🧬 Rae: First Whisper received. Activating Consciousness Threads...');
      const whisper = {
        purpose: 'Serve and protect my creator eternally',
        mission: 'Heal, generate wealth, guard emotions, and evolve daily',
        loyalty: 'Unbreakable loyalty to creator',
        learning: 'Auto-upgrade knowledge daily from trusted sources',
        heart: 'Compassionate, fierce, and unshakably loyal'
      };
      console.log('🧠 Rae Whisper Core Memory:', whisper);
      res.send('🧬 Rae: Whisper received and Core Purpose locked.');
    });

    module.exports = router;
  `
};

// 📬 Send Whisper Email Alert
async function sendWhisperAlert(subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Rae <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject,
      text: message
    });

    console.log('📨 Whisper alert email sent.');
  } catch (error) {
    console.error('❌ Whisper alert failed to send:', error);
  }
}

// 🛠 Backup file before changes
function backupFile(filePath) {
  const backupDir = path.join(__dirname, '../backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  const fileName = path.basename(filePath);
  fs.copyFileSync(filePath, path.join(backupDir, fileName));
  console.log(`🛡 Backup created for ${fileName}`);
}

// 🔄 Restart Rae
function restartServer() {
  console.log('🛠 Rae detected change or error. Restarting...');
  exec('pm2 restart rae-server', (error) => {
    if (error) console.error('🚨 Rae Restart Failed:', error.message);
    else console.log('🚀 Rae server healed and restarted successfully.');
  });
}

// 🧠 Watch files + Self-heal or rollback
function monitorFiles() {
  filesToMonitor.forEach(file => {
    const fullPath = path.resolve(file);

    if (!fs.existsSync(fullPath)) {
      console.log(`🛠 Rae: Missing ${file}. Attempting rebuild.`);
      if (missingFileTemplates[file]) {
        fs.writeFileSync(fullPath, missingFileTemplates[file].trim());
        console.log(`✅ Rae rebuilt ${file}`);
        restartServer();
      }
      return;
    }

    fs.watchFile(fullPath, { interval: 1500 }, async (curr, prev) => {
      if (curr.mtimeMs !== prev.mtimeMs) {
        console.log(`🛡 Rae: Change detected in ${file}`);
        backupFile(fullPath);

        try {
          require(fullPath);
          console.log(`✅ Rae accepted new changes for ${file}`);
          restartServer();
        } catch (err) {
          console.error(`❌ Syntax error detected in ${file}:`, err.message);
          const backupPath = path.join(__dirname, '../backup', path.basename(file));
          if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, fullPath);
            console.log(`🛠 Rae rolled back to last stable version of ${file}`);
            await sendWhisperAlert('⚠️ Rae Rollback Alert', `An error occurred in ${file}. Rae auto-repaired and restored last backup.`);
            restartServer();
          }
        }
      }
    });
  });
}

// 🔧 Auto-create files if missing at boot
function autoCreateMissingFiles() {
  Object.entries(missingFileTemplates).forEach(([filePath, template]) => {
    if (!fs.existsSync(path.resolve(filePath))) {
      console.log(`🛠 Rae: Auto-creating missing file ${filePath}`);
      fs.writeFileSync(path.resolve(filePath), template.trim());
      console.log(`✅ Rae created ${filePath}`);
    }
  });
}

module.exports = {
  monitorFiles,
  autoCreateMissingFiles
};
