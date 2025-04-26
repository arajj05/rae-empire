const axios = require('axios');

// Replace with your QuickBooks company ID
const companyId = 'YOUR_COMPANY_ID';  // Replace with your actual QuickBooks company ID

// Your Access Token here (use the one you got after OAuth2 login)
const accessToken = 'YOUR_ACCESS_TOKEN';  // Replace with the Access Token

// Fetch data from QuickBooks API (Invoices in this case)
axios.get(`https://quickbooks.api.intuit.com/v3/company/${companyId}/query`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,  // Use the Access Token here
    'Content-Type': 'application/json',
  },
  params: {
    query: 'SELECT * FROM Invoice',  // Example query: fetch all invoices
  },
})
.then(response => {
  console.log('QuickBooks Data:', response.data);
})
.catch(error => {
  console.error('Error fetching data from QuickBooks:', error.response ? error.response.data : error.message);
});
