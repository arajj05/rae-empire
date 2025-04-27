const axios = require('axios');

// Replace with your actual refresh token, client ID, and client secret
const refreshToken = 'RT1-11-H0-1754353037lzs5jdv777fllh5imqdv';  // Replace with your actual refresh token
const clientId = 'ABhhFcGAPNJlLY6A57KA78G8pRJoaMeCWUzIhVRAtn4kpA8gRO';  // Replace with your actual client ID
const clientSecret = 'tqZuwmBeBtmwwMmVbj4OwR20yeeftrVndPgw3rAc';  // Replace with your actual client secret

// Prepare the data for the request
const params = new URLSearchParams();
params.append('grant_type', 'refresh_token');
params.append('refresh_token', refreshToken);

axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', params.toString(), {
  headers: {
    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
.then(response => {
  console.log('New Access Token:', response.data.access_token);  // Will print the new access token
})
.catch(error => {
  console.error('Error refreshing token:', error.response ? error.response.data : error.message);  // Handle any errors
});
