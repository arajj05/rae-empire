const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

// 📈 Log every sale into a file
function logSale(sale) {
  const log = `${new Date().toISOString()} - Sale: $${sale.amount} by ${sale.buyer}\n`;
  fs.appendFileSync('./backend/salesLog.txt', log);
}

// 📬 Send automatic Thank You Email
async function sendThankYouEmail(buyerEmail, amount) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Rae Sales" <${process.env.EMAIL_USER}>`,
    to: buyerEmail,
    subject: 'Thank You for Your Purchase!',
    text: `Thank you for your payment of $${amount}. Your order is being processed! 🚀`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Thank You Email sent to ${buyerEmail}`);
  } catch (error) {
    console.error('❌ Failed to send Thank You Email:', error.message);
  }
}

// 🧠 Master function Rae calls after detecting a payment
async function handleNewSale(sale) {
  logSale(sale);
  await sendThankYouEmail(sale.buyerEmail, sale.amount);
}

module.exports = { handleNewSale };
