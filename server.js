// Import required packages
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;  // Default to port 3000, or use an environment variable

// Use middleware
app.use(cors());
app.use(express.json());  // For parsing JSON request bodies
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// QuickBooks OAuth route (Initiates OAuth flow)
app.get('/auth', (req, res) => {
  const redirectUri = process.env.QB_REDIRECT_URI;  // The redirect URI for QuickBooks
  const clientId = process.env.QB_CLIENT_ID;
  const state = Math.random().toString(36).substring(7);  // Generate random state

  // Store state in session for later comparison
  req.session.state = state;

  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${redirectUri}&state=${state}`;
  res.redirect(authUrl);  // Redirect to QuickBooks for authorization
});

// QuickBooks callback route to exchange code for tokens
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  // Verify the state parameter
  if (state !== req.session.state) {
    return res.status(400).send('State mismatch error');
  }

  // Exchange the authorization code for an access token
  const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  const auth = Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      tokenUrl,
      `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.QB_REDIRECT_URI}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Store access token and refresh token in session
    req.session.access_token = response.data.access_token;  // Store the access token
    req.session.refresh_token = response.data.refresh_token;  // Store the refresh token

    // Log tokens to verify everything is working
    console.log("Access Token: ", req.session.access_token);
    console.log("Refresh Token: ", req.session.refresh_token);

    // Send success response with tokens
    res.json({ message: 'Authorization successful', tokens: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error exchanging code for token');
  }
});

// QuickBooks API call using the access token (example)
app.get('/companyinfo', async (req, res) => {
  const accessToken = req.session.access_token;
  const companyId = process.env.QB_COMPANY_ID;  // Ensure this value is correct

  // Log the access token to ensure it's stored correctly
  console.log("Access Token used for API call: ", accessToken);

  if (!accessToken) {
    return res.status(400).send('Access token is missing');
  }

  try {
    const url = `https://quickbooks.api.intuit.com/v3/company/${companyId}/companyinfo/${companyId}`;
    console.log('Making API request to:', url);  // Log the API URL

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Use the access token here
      },
    });

    console.log('Company Info:', response.data);  // Log the API response data
    res.json(response.data);  // Send company info response
  } catch (error) {
    // Detailed error logging
    console.error('Error fetching company info:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching company info');
  }
});

// Refresh the access token using the refresh token (when the access token expires)
app.get('/refresh', async (req, res) => {
  const refreshToken = req.session.refresh_token;

  if (!refreshToken) {
    return res.status(400).send('Refresh token is missing');
  }

  const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  const auth = Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      tokenUrl,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Store the new access token and refresh token in the session
    req.session.access_token = response.data.access_token;  // Store the new access token
    req.session.refresh_token = response.data.refresh_token;  // Store the new refresh token

    res.json({ message: 'Tokens refreshed successfully', tokens: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error refreshing token');
  }
});

// Test route for checking server is working
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT}`);
});
