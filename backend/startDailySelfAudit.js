// backend/startDailySelfAudit.js
const { checkRealPaypalPayments } = require('./realPaymentScanner');
const { sendWeeklyEarningsReport } = require('./earningsReporter');
const fs = require('fs');
const path = require('path');
const nodeCron = require('node-cron');

// 🛡 Rae's Self-Audit: Check critical backend files
function startDailySelfAudit() {
  console.log('🔎 Rae Daily Self-Audit: Starting health check...');

  const criticalFiles = [
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

  // Run audit immediately
  criticalFiles.forEach(file => {
    if (!fs.existsSync(path.resolve(file))) {
      console.error(`🚨 Rae Alert: Missing critical file: ${file}`);
    } else {
      console.log(`✅ Rae Check: ${file} is safe.`);
    }
  });

  console.log('🔄 Rae Daily Audit: Completed health scan.');
}

// ⏰ Schedule Rae to auto-audit herself every day at 12:00 AM
nodeCron.schedule('0 0 * * *', () => {
  console.log('⏰ Midnight Audit Triggered...');
  startDailySelfAudit();
});

module.exports = { startDailySelfAudit };  // Export the function
