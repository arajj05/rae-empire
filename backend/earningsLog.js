// backend/earningsLog.js

const axios = require("axios");
const fs = require("fs");
const refreshAccessToken = require("./refreshToken");  // Import the refresh function

async function getEarnings() {
  let tokens = JSON.parse(fs.readFileSync("./backend/tokens.json"));
  let accessToken = tokens.access_token;
  let realmId = tokens.realmId;

  // Check if the access token has expired (optional: you can check 'expires_in' field)
  if (Date.now() / 1000 > tokens.expires_in) {  // If token expired
    console.log("Access token expired. Refreshing...");
    const newTokens = await refreshAccessToken();  // Refresh the token
    accessToken = newTokens.access_token;  // Use the new access token
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
  };

  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/reports/ProfitAndLoss?start_date=2024-01-01&end_date=2024-12-31`;

  try {
    const response = await axios.get(url, { headers });
    console.log("QuickBooks API Response:", response.data);  // Log the response data
    return response.data;
  } catch (error) {
    // Log detailed error information
    console.error("Error fetching earnings data: ", error.response?.data || error.message);
    throw new Error("Error fetching earnings.");
  }
}

module.exports = { getEarnings };
