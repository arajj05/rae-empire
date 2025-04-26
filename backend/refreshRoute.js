// backend/refreshToken.js

const axios = require("axios");
const fs = require("fs");
require("dotenv").config();  // Load environment variables

async function refreshAccessToken() {
  // Read tokens from tokens.json
  const tokens = JSON.parse(fs.readFileSync("./backend/tokens.json"));
  const refreshToken = tokens.refresh_token;

  // QuickBooks token URL
  const url = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

  // Encode client credentials in base64
  const authHeader = Buffer.from(
    `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
  ).toString("base64");

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${authHeader}`,
    Accept: "application/json",
  };

  // Prepare the body to send to QuickBooks
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,  // Use the refresh token
  });

  try {
    // Make the request to QuickBooks to get a new access token
    const response = await axios.post(url, body.toString(), { headers });

    console.log("Token Refresh Success:", response.data);

    // Save the new tokens to tokens.json
    const newTokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token, // The refresh token may change as well
      expires_in: response.data.expires_in,
      x_refresh_token_expires_in: response.data.x_refresh_token_expires_in,
    };

    // Save the new tokens to tokens.json
    fs.writeFileSync("./backend/tokens.json", JSON.stringify(newTokens, null, 2));

    return newTokens;
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    throw error;
  }
}

module.exports = refreshAccessToken;
