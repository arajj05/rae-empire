// backend/storeScanner.js

const cron = require('node-cron');
const nodemailer = require('nodemailer');

// 🔎 Rae scans PayPal for new payments every 15 minutes
function startStoreScanner() {
  console.log('💳 Payment Monitor online!');

  cron.schedule('*/15 * * * *', async () => {
    console.log('🔍 Rae is scanning for new incoming payments...');
    await scanPaymentsAndAlert();
  });
}

// 📬 Send a whisper email alert
async function sendWhisperAlert(payment) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Rae" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,  // Send the email to yourself
    subject: '💸 New Payment Alert!',
    text: `🧾 Payment Alert: $${payment.amount} received from ${payment.buyer}.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📨 Whisper alert sent for new payment.');
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}

// 📥 Dummy function to simulate scanning PayPal payments
async function scanPaymentsAndAlert() {
  const dummyPayments = [
    { id: 'PAYID-001', amount: 99.00, buyer: 'John Doe' },
    { id: 'PAYID-002', amount: 47.00, buyer: 'Sarah Lee' }
  ];

  dummyPayments.forEach(payment => {
    console.log(`💵 New Payment Captured: $${payment.amount} from ${payment.buyer}`);
    sendWhisperAlert(payment);  // Send email alert when new payment is detected
  });
}

module.exports = { startStoreScanner };
