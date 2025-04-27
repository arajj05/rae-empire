const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 📊 Compile and send weekly earnings report
async function sendWeeklyEarningsReport() {
  try {
    const salesLog = fs.readFileSync('./backend/salesLog.txt', 'utf-8') || 'No sales logged yet.';
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Rae Reports" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '📈 Rae Weekly Earnings Report',
      text: `Here is your weekly earnings summary:\n\n${salesLog}`
    };

    await transporter.sendMail(mailOptions);
    console.log('📨 Weekly Earnings Report sent!');
  } catch (err) {
    console.error('❌ Failed to send Weekly Earnings Report:', err.message);
  }
}

module.exports = { sendWeeklyEarningsReport };
