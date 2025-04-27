const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function checkRealPaypalPayments() {
  try {
    const response = await axios.get('https://api.paypal.com/v1/reporting/transactions', {
      headers: {
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`
      },
      params: {
        start_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Check last 24h
        end_date: new Date().toISOString(),
        transaction_status: 'S'
      }
    });

    const transactions = response.data.transaction_details || [];

    if (transactions.length > 0) {
      transactions.forEach(tx => {
        const amount = tx.transaction_info.transaction_amount.value;
        const payer = tx.payer_info.email_address;
        const saleInfo = `💵 Real Sale Detected! Amount: $${amount}, Payer: ${payer}\n`;
        
        console.log(saleInfo);
        fs.appendFileSync('./backend/salesLog.txt', `${new Date().toLocaleString()} - ${saleInfo}`);
      });
    } else {
      console.log('👀 No new real sales detected.');
    }
  } catch (err) {
    console.error('❌ Failed to fetch real sales:', err.message);
  }
}

module.exports = { checkRealPaypalPayments };
