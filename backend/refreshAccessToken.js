const axios = require('axios');
const qs = require('qs');

// Replace with your actual refresh token, client ID, client secret, and redirect URI
const refreshToken = 'your-refresh-token-here';  // Replace with your actual refresh token
const clientId = 'your-client-id-here';  // Replace with your actual client ID
const clientSecret = 'your-client-secret-here';  // Replace with your actual client secret
const redirectUri = 'http://localhost:3000/callback';  // Your redirect URI

// Prepare the data for the token request
const data = qs.stringify({
  grant_type: 'refresh_token',
  refresh_token: refreshToken,
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri
});

// Make the request to refresh the token
axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
.then(response => {
  // Save the new access token
  const newAccessToken = response.data.access_token;
  console.log('New Access Token:', newAccessToken);  // Save this new token for use in subsequent requests
})
.catch(error => {
  console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
});
