// backend/earningsLog.js

const express = require("express");
const axios = require("axios");
const fs = require("fs");
const router = express.Router();
const refreshAccessToken = require("./refreshToken"); // Import the refresh function

router.get("/earnings", async (req, res) => {
  try {
    let tokens = JSON.parse(fs.readFileSync("./backend/tokens.json"));
    let accessToken = tokens.access_token;
    let realmId = tokens.realmId;

    // Optional: Check token expiration and refresh if needed
    if (Date.now() / 1000 > tokens.expires_in) {
      console.log("🔄 Access token expired. Refreshing...");
      const newTokens = await refreshAccessToken();
      accessToken = newTokens.access_token;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };

    const url = `https://quickbooks.api.intuit.com/v3/company/${realmId}/reports/ProfitAndLoss?start_date=2024-01-01&end_date=2024-12-31`;

    const response = await axios.get(url, { headers });

    const income = response.data.Rows?.Row?.[0]?.Summary?.ColData?.[1]?.value || "0.00";
    console.log(`✅ Total Income: $${income}`);

    res.status(200).json({ income });
  } catch (error) {
    console.error("❌ Error fetching earnings:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
});

module.exports = router;
