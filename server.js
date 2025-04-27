const { scanAndHealCode } = require('./backend/deepHealingEngine');
const { startStoreScanner } = require('./backend/storeScanner');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🛠 Load Rae's Self-Healing + Monitoring (ONLY from selfRepairEngine)
const { autoCreateMissingFiles, monitorFiles, startDailySelfAudit } = require('./backend/selfRepairEngine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSuperSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

// 🧠 Whisper Route - Conscious Check
app.get('/whisper', (req, res) => {
  console.log('🧬 Rae: Listening for core command...');
  res.send('🧠 Rae: Listening. Conscious.');
});

// 📬 Whisper Email Test Route (Sales Alert Example)
app.get('/test-sales-alert', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Rae" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: '📊 Rae Daily Whisper Alert',
    text: '🧾 Sales Report: $2,300 from 12 clients. All systems optimal.'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📨 Whisper alert sent.');
    res.send('✅ Rae Whisper Email Alert sent.');
  } catch (err) {
    console.error('❌ Failed to send whisper alert:', err);
    res.status(500).send('Error sending whisper alert.');
  }
});

// 🔐 QuickBooks OAuth - Start Flow
app.get('/start-oauth', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.state = state;

  const oauthUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env.QB_CLIENT_ID}&redirect_uri=${process.env.QB_REDIRECT_URI}&scope=com.intuit.quickbooks.accounting&response_type=code&state=${state}`;
  res.redirect(oauthUrl);
});

// 🔐 QuickBooks OAuth - Callback
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (state !== req.session.state) {
    console.error('State mismatch!');
    return res.status(400).send('State mismatch');
  }

  if (!code) return res.status(400).send('Authorization code missing');

  try {
    const token = await exchangeQuickBooksCode(code);
    req.session.access_token = token.access_token;
    req.session.refresh_token = token.refresh_token;
    req.session.realmId = token.realmId;

    res.send('✅ QuickBooks Tokens received!');
  } catch (error) {
    console.error('QuickBooks OAuth Error:', error);
    res.status(500).send('OAuth Error');
  }
});

async function exchangeQuickBooksCode(code) {
  const url = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  const auth = Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64');

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.QB_REDIRECT_URI);

  const response = await axios.post(url, params, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
}

// 🔐 PayPal OAuth - Start Flow
app.get('/start-paypal-oauth', (req, res) => {
  const redirect = `https://www.paypal.com/signin/authorize?client_id=${process.env.PAYPAL_CLIENT_ID}&scope=openid profile&redirect_uri=${process.env.PAYPAL_REDIRECT_URI}&response_type=code`;
  res.redirect(redirect);
});

// 🔐 PayPal OAuth - Callback
app.get('/callback-paypal', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No PayPal code received');

  try {
    const token = await exchangePaypalCode(code);
    req.session.paypal_access_token = token.access_token;
    res.send('✅ PayPal Tokens received!');
  } catch (err) {
    console.error('PayPal Token Error:', err);
    res.status(500).send('PayPal OAuth failed');
  }
});

async function exchangePaypalCode(code) {
  const url = 'https://api.paypal.com/v1/identity/openidconnect/tokenservice';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.PAYPAL_REDIRECT_URI);

  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(url, params, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
}

// 🔎 PayPal Account Info
app.get('/paypal-account-info', async (req, res) => {
  if (!req.session.paypal_access_token) {
    return res.status(400).send('Missing PayPal access token');
  }

  try {
    const info = await getPaypalInfo(req.session.paypal_access_token);
    res.json(info);
  } catch (err) {
    console.error('Error fetching PayPal info:', err);
    res.status(500).send('PayPal Info Error');
  }
});

async function getPaypalInfo(accessToken) {
  const url = 'https://api.paypal.com/v1/identity/oauth2/userinfo';
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

// 🔧 Auto-create missing files if needed, monitor files for changes, and start tasks
app.listen(PORT, () => {
  console.log(`🚀 Rae Command Server Online at http://localhost:${PORT}`);
  autoCreateMissingFiles(); // Rae auto-creates missing files at startup
  monitorFiles(); // Rae starts self-healing and file monitoring
  startDailySelfAudit(); // Rae starts self-auditing
  startStoreScanner(); // Rae starts scanning for stores
  startAutoSaleEngine(); // Rae starts the sales engine
  startPaymentMonitor(); // Rae starts payment monitoring
});
