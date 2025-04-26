const axios = require('axios');

// Replace with your actual access token
const accessToken = 'your-access-token-here'; 

// Make the API call to get company info
axios.get('https://quickbooks.api.intuit.com/v3/company/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Company Info:', response.data);
  console.log('Company ID:', response.data.CompanyInfo.Id);  // This will print your company ID (realm ID)
})
.catch(error => {
  console.error('API Error:', error);
});
