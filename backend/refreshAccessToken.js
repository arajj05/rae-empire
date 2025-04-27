const axios = require('axios');
const qs = require('qs');

// Replace with your actual Refresh Token and credentials
const refreshToken = 'RT1-11-H0-1754353037lzs5jdv777fllh5imqdv';  // Your refresh token from the OAuth process
const clientId = 'ABhhFcGAPNJlLY6A57KA78G8pRJoaMeCWUzIhVRAtn4kpA8gRO';  // Your QuickBooks Client ID
const clientSecret = 'tqZuwmBeBtmwwMmVbj4OwR20yeeftrVndPgw3rAc';  // Your QuickBooks Client Secret

// The credentials for Basic Authentication (encoded client_id:client_secret)
const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Request body to refresh access token
const refreshRequestBody = qs.stringify({
  grant_type: 'refresh_token',
  refresh_token: refreshToken,  // Using the stored refresh token
  client_id: clientId,  // Your QuickBooks Client ID
  client_secret: clientSecret,  // Your QuickBooks Client Secret
});

// Make the request to refresh the access token
axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', refreshRequestBody, {
  headers: {
    'Authorization': `Basic ${authHeader}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
.then(response => {
  // Output the new access token and refresh token
  console.log('New Access Token:', response.data.access_token);
  console.log('New Refresh Token:', response.data.refresh_token);
})
.catch(error => {
  console.error('Error refreshing token:', error.response ? error.response.data : error.message);
});
