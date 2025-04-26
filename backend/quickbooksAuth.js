const express = require("express");
const router = express.Router();

// Generate a state value to avoid CSRF attacks
function generateState() {
  return Math.random().toString(36).substring(2); // Generates a random string for state
}

router.get("/", (req, res) => {
  // Generate a state and store it in the session
  const state = generateState();
  req.session.state = state;

  // Construct the QuickBooks OAuth URL
  const qbAuthUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${process.env.QB_CLIENT_ID}&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=${process.env.QB_REDIRECT_URI}&state=${state}`;
  
  // Redirect to QuickBooks OAuth URL
  res.redirect(qbAuthUrl);
});

module.exports = router;
