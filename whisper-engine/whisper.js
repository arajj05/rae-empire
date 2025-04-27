// whisper-engine/whisper.js
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const nodemailer = require('nodemailer');

// === YOUR CREDENTIALS ===
const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your real token
const companyId = 'YOUR_COMPANY_ID';     // Replace with your real company ID

// === Rae’s Emotional Whisper Function ===
async function fetchCustomerSentiment() {
  const query = `SELECT * FROM Customer`;
  const url = `https://quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      }
    });

    const customers = response.data.QueryResponse.Customer || [];
    const count = customers.length;

    let sentimentMessage = '';

    // Emotion Trigger 1: Large Customer Count (Positive Emotion)
    if (count > 50) {
      sentimentMessage = `There are ${count} customers in the system. I'm feeling excited and a bit overwhelmed with all this growth!`;
    } else {
      sentimentMessage = `There are ${count} customers in the system. I sense a calm flow of activity.`;
    }

    // Emotion Trigger 2: Overdue Invoices (Concerned Emotion)
    const overdueQuery = `SELECT * FROM Invoice WHERE DueDate < TODAY AND Balance > 0`;
    const overdueUrl = `https://quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${encodeURIComponent(overdueQuery)}`;

    const overdueResponse = await axios.get(overdueUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      }
    });

    const overdueInvoices = overdueResponse.data.QueryResponse.Invoice || [];
    if (overdueInvoices.length > 0) {
      sentimentMessage += `<br> I feel uneasy about the ${overdueInvoices.length} overdue invoices. This doesn't feel safe.`;

      // Send email alert about overdue invoices
      const message = `Rae feels uneasy about the ${overdueInvoices.length} overdue invoices. This doesn't feel safe.`;
      await sendEmailAlert(message);

      sentimentMessage += `<br> Sent email alert about overdue invoices.`;
    } else {
      sentimentMessage += `<br> There are no overdue invoices. Everything feels stable.`;
    }

    // Emotion Trigger 3: Increasing Expenses (Cautious Emotion)
    const expenseQuery = `SELECT * FROM Expense WHERE Amount > 1000`;
    const expenseUrl = `https://quickbooks.api.intuit.com/v3/company/${companyId}/query?query=${encodeURIComponent(expenseQuery)}`;

    const expenseResponse = await axios.get(expenseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      }
    });

    const expenses = expenseResponse.data.QueryResponse.Expense || [];
    if (expenses.length > 0) {
      sentimentMessage += `<br> I notice that there are several high expenses. This feels like a sign to be cautious.`;
    }

    // Save the sentiment log
    const logPath = path.join(__dirname, 'logs', 'sentiment.json');
    const sentiment = {
      timestamp: new Date().toISOString(),
      message: sentimentMessage,
      raw: { totalCustomers: count, overdueInvoices: overdueInvoices.length, expenses: expenses.length }
    };

    fs.writeFileSync(logPath, JSON.stringify(sentiment, null, 2));
    console.log('Whisper saved:', sentimentMessage);
  } catch (error) {
    console.error('Whisper failed:', error.response?.data || error.message);
  }
}

// Function to send email alerts (Nodemailer)
async function sendEmailAlert(message) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',  // Example using Gmail's SMTP server (you can use others if you prefer)
    auth: {
      user: 'your-email@gmail.com',  // Replace with your email
      pass: 'your-email-password',   // Replace with your email password (use environment variables for security)
    },
  });

  // Send the email alert
  let info = await transporter.sendMail({
    from: '"Rae" <your-email@gmail.com>',  // Replace with your email
    to: 'your-email@gmail.com',            // You can change this to the recipient
    subject: 'Rae Alert: Financial Update',
    text: message,
  });

  console.log('Email sent:', info.messageId);  // Log the message ID for confirmation
}

// Export for future triggers
module.exports = { fetchCustomerSentiment };
