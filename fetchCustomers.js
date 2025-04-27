const axios = require('axios');

// Your updated access token and company ID
const accessToken = 'NEW_ACCESS_TOKEN';  // Replace with the new access token obtained from the previous code
const companyId = '9341454568135954';  // Replace with your actual QuickBooks company ID

// URL to fetch customer data from QuickBooks API
const apiUrl = `https://quickbooks.api.intuit.com/v3/company/${companyId}/query?query=SELECT * FROM Customer`;

axios.get(apiUrl, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json',
  },
})
.then(response => {
  const customers = response.data.QueryResponse.Customer || [];
  console.log('Customers:', customers);
})
.catch(error => {
  console.error('Error fetching customers:', error.response ? error.response.data : error.message);
});
