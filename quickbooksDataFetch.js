const axios = require('axios');

// Your actual QuickBooks company ID (realmId)
const companyId = '9341454568135954';  // Replace with your actual QuickBooks company ID (realmId)

// Your Access Token here (use the one you got after OAuth2 login)
const accessToken = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..cUDPdi-9LlfuG1JX79k4Tw.wTgEj9JmBET4kuLzLJsaI7z0EpzmTplK8jKClXYY8f32_ZMmn6AQOW8mU3yfovoyK42ZYvkxUHl_5f24zYUIhqDRxNhEQw4Ixg1cFcgm8Dv9kXyosaoaS9C4fibZ8Ik8IvBEEZ5iYJzLVc_sv117hIVCht86rAL9ow19Co9QzjKVu1nq7mzhRQ45bM6031VI4JybOW0MHfIwdTF9oUhvtsGg8PWRnT-13sS7EXjvPBZKQg91gqaDr8k2QB_pAb7MwGyOJgzMa4PCyvBBQsKrIC3_94d5UKqkvRDPTUm27ukQ9YqrItYpWhhC-xiz5_nSfe6gPpSNurALxDO3m7NCHKB4OKOr1l6nT1CMAV5gRb7tZolx-2wI0IekD9uhoWK4Ft1UwQDBH4CnfjKKAfXzKaHeobbp0j9rquTL72czbwmGWgfKMI2WFJ7G6MTbvQsHoFktXGMSoyATPo7xvuLLNEPA7sHUvdEASib3P4UQ3EU.3c9vSruhnr0hq8Ga8ZoviA';  // Replace with the Access Token

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
