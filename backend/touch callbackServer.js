const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/callback", async (req, res) => {
  const { code, state } = req.query;  // Extract the authorization code and state from the query params

  if (!code) {
    console.error("❌ No authorization code received!");
    return res.status(400).send("<h2>❌ Error: No authorization code received!</h2>");
  }

  // Ensure that the state matches (add security by verifying the state)
  const expectedState = req.session.state;  // Retrieve the stored state from the session
  if (state !== expectedState) {
    console.error("❌ State mismatch!");
    return res.status(400).send("<h2>❌ Error: State mismatch!</h2>");
  }

  try {
    const tokenResponse = await exchangeCodeForTokens(code); // Function to exchange code for tokens
    console.log('Token Response:', tokenResponse);
    res.send('Authorization complete!');
  } catch (error) {
    console.error("❌ Error exchanging code for tokens:", error);
    res.status(500).send("<h2>❌ Error exchanging code for tokens</h2>");
  }
});

async function exchangeCodeForTokens(code) {
  const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  const clientId = process.env.QB_CLIENT_ID;
  const clientSecret = process.env.QB_CLIENT_SECRET;
  const redirectUri = process.env.QB_REDIRECT_URI;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code");

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data; // This should contain access_token, refresh_token, etc.
  } catch (error) {
    console.error("Error during token exchange:", error);
    throw error;
  }
}

module.exports = router;
