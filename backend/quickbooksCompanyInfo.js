const axios = require('axios');

// Replace with your new access token
const accessToken = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9...';  // Paste your actual access token here

// Company info URL
const companyInfoUrl = 'https://quickbooks.api.intuit.com/v3/company/9341454568135954/companyinfo/9341454568135954';

// Make the API call
axios.get(companyInfoUrl, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Company Info:', response.data); // Print the company info if the request is successful
})
.catch(error => {
  if (error.response) {
    // The server responded with an error
    console.error('Error from API:', error.response.data);
    console.error('Error status:', error.response.status);  // Check the status code for more info
  } else if (error.request) {
    // No response received from the server
    console.error('No response from API:', error.request);
  } else {
    // Any other error
    console.error('Error occurred:', error.message);
  }
});
