const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();  // Load environment variables from .env

const QB_CLIENT_ID = process.env.QB_CLIENT_ID;
const QB_CLIENT_SECRET = process.env.QB_CLIENT_SECRET;
const QB_REDIRECT_URI = process.env.QB_REDIRECT_URI;

// Step 1: Redirect to QuickBooks Login
exports.redirectToQuickBooksLogin = (req, res) => {
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?${querystring.stringify({
    client_id: QB_CLIENT_ID,
    redirect_uri: QB_REDIRECT_URI,
    response_type: 'code',
    scope: 'com.intuit.quickbooks.accounting',
    state: 'random_state_string'  // Optional: Prevents CSRF attacks
  })}`;

  res.redirect(authUrl);  // Redirect user to QuickBooks login
};

// Step 2: Handle Callback & Exchange Authorization Code for Tokens
exports.handleCallback = async (req, res) => {
  const { code } = req.query;  // Get authorization code from query params

  const requestBody = {
    code,
    client_id: QB_CLIENT_ID,
    client_secret: QB_CLIENT_SECRET,
    redirect_uri: QB_REDIRECT_URI,
    grant_type: 'authorization_code'
  };

  try {
    const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', querystring.stringify(requestBody), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const accessToken = response.data.access_token;  // Store access token
    const refreshToken = response.data.refresh_token;  // Store refresh token

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    res.send('Authentication successful! You can now access your QuickBooks data.');
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.status(500).send('Error exchanging authorization code for tokens.');
  }
};
