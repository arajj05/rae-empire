const axios = require('axios');
const qs = require('qs');
require('dotenv').config();  // Load environment variables from .env

// QuickBooks credentials from .env file
const clientId = process.env.QB_CLIENT_ID || 'ABhhFcGAPNJlLY6A57KA78G8pRJoaMeCWUzIhVRAtn4kpA8gRO';  // Client ID from QuickBooks Developer Portal
const clientSecret = process.env.QB_CLIENT_SECRET || 'tqZuwmBeBtmwwMmVbj4OwR20yeeftrVndPgw3rAc';  // Client Secret from QuickBooks Developer Portal
const redirectUri = process.env.QB_REDIRECT_URI || 'http://localhost:3000/callback';  // Redirect URI you have set

// Your Refresh Token and Access Token (replace with actual values from memory or environment)
const refreshToken = 'RT1-139-H0-1754400714dfzpedjg9d3ckmc0ik02';  // Refresh Token from previous OAuth flow
let accessToken = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..EoT7dHR8VqDpFpqBzxgkBg.XL54eJGlDlZeBIsz9fdBLnXkp96B1Irxah3GR0iUoqcsszecrTvMEpK8ERTAnNfhcohijpvj0PdQKrfKZVNbzYK3SggaleNCLDWPsWyoPS6qZHB-U1YmGanfcndv7aBz5Ia_pNVRG_oYAqxvwB_m3aNzzSYnJDu_YPUMcrhZQuBWonjyuAaUdhz_X2ZWk9-nUnaEF1b53HgPX0mawFgKuPGCUc8vcsIdQwTrWXGAcIxY1qy989pLft6hb_sbMj_WoJGxnQrAurVOYN5C0Fmw-8j6rhExHLxwcKq4P9FLd-D4ewSZzjRkdmO34qMjYycTukBqRzjyv8MtwNnhc0DtbUyG7g2f8366m_ct2psM0iSpUt-UQWeExq3j2Vtpy8P11gxLixSs-z3XlmwCvLytDjh4cVGw_1SntkuBKAKigPsUBEp8lrAhkfdko2zXmsBkwB1q9BxkdnCdQa7hSxOsyqDoFrD7p3bOCve4-oAfSr8.PeQZEd7z8LSr8MIvcIYTLA';  // Access Token from OAuth response

// Replace with your QuickBooks company ID (I have it based on memory)
const companyId = '9341454568135954';  // Your QuickBooks Company ID from QuickBooks Developer Portal

// Function to fetch QuickBooks data (like invoices)
const fetchQuickBooksData = () => {
  axios.get(`https://quickbooks.api.intuit.com/v3/company/${companyId}/query`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,  // Use the Access Token here
      'Content-Type': 'application/json',
    },
    params: {
      query: 'SELECT * FROM Invoice',  // Example query to fetch invoices
    },
  })
  .then(response => {
    console.log('QuickBooks Data:', response.data);
  })
  .catch(error => {
    console.error('Error fetching data from QuickBooks:', error.response ? error.response.data : error.message);

    // If the error is related to an expired access token, refresh the token
    if (error.response && error.response.status === 401) {
      console.log('Access Token expired, refreshing token...');
      refreshAccessToken();
    }
  });
};

// Function to refresh the Access Token
const refreshAccessToken = () => {
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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
    accessToken = response.data.access_token;  // Update the Access Token
    console.log('New Access Token:', accessToken);
    console.log('New Refresh Token:', response.data.refresh_token);
    
    // After refreshing the token, try fetching data again
    fetchQuickBooksData();
  })
  .catch(error => {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
  });
};

// Initial call to fetch QuickBooks data
fetchQuickBooksData();
