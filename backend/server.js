// Import required packages
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios'); // Make sure axios is imported for API calls
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

// QuickBooks OAuth route
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

    // Store access token and refresh token in session or database
    req.session.access_token = response.data.access_token;
    req.session.refresh_token = response.data.refresh_token;

    res.json({ message: 'Authorization successful', tokens: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error exchanging code for token');
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
