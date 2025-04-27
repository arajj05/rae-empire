const { handleNewSale } = require('./salesResponder');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

// 🔎 Rae checks PayPal every 15 minutes
function startPaymentMonitor() {
  console.log('💳 Rae Payment Monitor activated.');

  cron.schedule('*/15 * * * *', async () => {
    console.log('🔍 Rae scanning for new payments...');
    try {
      await scanPaypalPayments();
    } catch (error) {
      console.error('❌ Payment Monitor Error:', error.message);
    }
  });
}

// 📥 Fetch PayPal payments (dummy simulation)
async function scanPaypalPayments() {
  // Later this will become real PayPal API pulling
  const dummyPayments = [
    { id: 'PAYID-001', amount: 99.00, buyer: 'John Doe' },
    { id: 'PAYID-002', amount: 47.00, buyer: 'Sarah Lee' }
  ];

  dummyPayments.forEach(payment => {
    console.log(`💵 New Payment Captured: $${payment.amount} from ${payment.buyer}`);
    handleNewSale({
      buyerEmail: 'buyer@example.com',  // Placeholder email (replace with real email in real API)
      amount: payment.amount,
      buyer: payment.buyer
    });
  });
}

module.exports = { startPaymentMonitor };
