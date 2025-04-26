// backend/exchangeCode.js

const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();  // Load environment variables

async function exchangeTokens(code, realmId) {
  const url = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

  const authHeader = Buffer.from(
    `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
  ).toString("base64");

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${authHeader}`,
    Accept: "application/json",
  };

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.QB_REDIRECT_URI,
  });

  try {
    const response = await axios.post(url, body.toString(), { headers });

    console.log("QuickBooks Response:", response.data);  // Log the full response

    const tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      x_refresh_token_expires_in: response.data.x_refresh_token_expires_in,
      realmId: realmId,
    };

    // Save tokens to tokens.json
    const tokenPath = path.join(__dirname, "tokens.json");
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

    return tokens;
  } catch (error) {
    console.error("❌ Token exchange failed:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = exchangeTokens;
