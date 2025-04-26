const axios = require('axios');

// Replace with your actual access token and realm ID (company ID)
const accessToken = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9.._rCIz_EoKweeZSN1Wdzv2w.3z874eVMA1O_T7PNFd9-ehTyqwQbdNWm2ylT6BUzH6Bexs3sMoJ9W0ALMTGKT8unrbowFkS0hSaXaWxzNyRPxBfc466VSvNHPr2xDXcqaWpPnvwaE9YN1cLLcbu5Geu189Ixi5vvuy6g6BKeSqVZBPWTcWnT_e6VfcIooXEDVRywrrwnsmQe7pc_hVrJeRZffOy_b47yIfSoF8cgftRPnf6pfKD6NBxPmNFVFg3eEKlfq4O7crv16gJuZVyETafMi5pFtnkYW2iIW_JH31jjrUey6_BFvy7JE0Vy_4X9IR9ciAU34ilg7YDpCl1S4TXC5WE_fn2-qFMk64WiEK34XZ6TAxvNIAK91yJT1g3148MV_1O_AT6Oq92USdeCBg0CLWJjy0lbOPRHJ6VaZaorT9y2b7ERjZnS-4WXioqWIhzYt08U-qijf6DtZDNIdhe-I5iFGttAIWIvYuyrOkwtxekD4rTaYn3q7BYyba0k0o0o';
const realmId = '9341454568135954'; // Replace with your actual realm ID (company ID)

// API call to get company info
axios.get(`https://quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Company Info:', response.data);
  // You can now access company details, like name, address, etc.
})
.catch(error => {
  console.error('Error fetching company info:', error);
});
