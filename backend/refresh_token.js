const axios = require('axios');
const qs = require('qs');

// Replace with your Refresh Token
const refreshToken = 'YOUR_REFRESH_TOKEN';  // Paste your Refresh Token here

// The credentials for Basic Authentication
const clientId = process.env.QB_CLIENT_ID;
const clientSecret = process.env.QB_CLIENT_SECRET;
const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Request to refresh the access token
axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', qs.stringify({
  grant_type: 'refresh_token',
  refresh_token: refreshToken,  // Use the Refresh Token here
}), {
  headers: {
    'Authorization': `Basic ${authHeader}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
.then(response => {
  console.log('New Access Token:', response.data.access_token);
  console.log('New Refresh Token:', response.data.refresh_token);
})
.catch(error => {
  console.error('Error refreshing token:', error.response ? error.response.data : error.message);
});
