const express = require('express');  // Require express
const crypto = require('crypto');
const session = require('express-session');
const axios = require('axios'); // For making API requests
const nodemailer = require('nodemailer'); // Import Nodemailer
const mailchimp = require('@mailchimp/mailchimp_marketing'); // Import Mailchimp

// Initialize the express app
const app = express();

// Use session middleware to store state
app.use(session({ secret: 'tqZuwmBeBtmwwMmVbj4OwR20yeeftrVndPgw3rAc', resave: false, saveUninitialized: true }));

// Credentials for QuickBooks (from memory)
const clientId = 'ABhhFcGAPNJlLY6A57KA78G8pRJoaMeCWUzIhVRAtn4kpA8gRO';  // Your QuickBooks client ID
const clientSecret = 'tqZuwmBeBtmwwMmVbj4OwR20yeeftrVndPgw3rAc';  // Your QuickBooks client secret
const redirectUri = 'http://localhost:3000/callback';  // This needs to be the same as your redirect URI

// Mailchimp API credentials
const mailchimpApiKey = 'YOUR_MAILCHIMP_API_KEY';  // Replace with your Mailchimp API key
const mailchimpServerPrefix = 'us1';  // Replace with your Mailchimp server prefix (e.g., 'us1', 'us2', etc.)

// Set up Mailchimp configuration
mailchimp.setConfig({
  apiKey: mailchimpApiKey,
  server: mailchimpServerPrefix,
});

// Create a transporter object using SMTP transport for email alerts
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can change this to the email provider you use
  auth: {
    user: 'publishing@solvaris-publishing-llc.com',  // Your email address for sending emails
    pass: 'Brevard@2018',   // Your email password
  },
});

// Function to send an email alert (optional)
async function sendEmailAlert(message) {
  try {
    const mailOptions = {
      from: '"Rae" <publishing@solvaris-publishing-llc.com>',  // sender address
      to: 'publishing@solvaris-publishing-llc.com',           // receiver address (same or different)
      subject: 'Rae Alert: Financial Update',
      text: message,                        // The message to send
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// OAuth route that starts the OAuth flow
app.get('/start-oauth', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.state = state;

  const oauthUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(oauthUrl);
});

// Route to handle QuickBooks OAuth callback and exchange authorization code for tokens
app.get('/callback', async (req, res) => {
  const receivedState = req.query.state;
  const expectedState = req.session.state;

  // State verification to prevent CSRF attacks
  if (receivedState !== expectedState) {
    return res.status(400).send('State mismatch');
  }

  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send('Authorization code is missing');
  }

  const tokenRequestBody = new URLSearchParams();
  tokenRequestBody.append('grant_type', 'authorization_code');
  tokenRequestBody.append('code', authorizationCode);
  tokenRequestBody.append('redirect_uri', redirectUri);
  tokenRequestBody.append('client_id', clientId);
  tokenRequestBody.append('client_secret', clientSecret);

  try {
    const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', tokenRequestBody.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    // Log the access and refresh tokens
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    res.send(`Access Token: ${accessToken}<br>Refresh Token: ${refreshToken}`);
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error.response ? error.response.data : error.message);
    res.status(500).send('Error exchanging authorization code for tokens');
  }
});

// Mailchimp function to send an email
async function sendMailchimpEmail(listId, subject, message) {
  try {
    const response = await mailchimp.messages.send({
      message: {
        subject: subject,
        from_email: 'publishing@solvaris-publishing-llc.com',
        to: [{ email: 'recipient@example.com' }], // Replace with recipient's email address
        text: message,
      },
    });
    console.log('Email sent via Mailchimp:', response);
  } catch (error) {
    console.error('Error sending email via Mailchimp:', error);
  }
}

// Start the app
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the app!');
});
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    // Make the API call to your backend
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/companyinfo`)
      .then(response => {
        setCompanyInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching company info:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>QuickBooks Company Info</h1>
      {companyInfo ? (
        <pre>{JSON.stringify(companyInfo, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
