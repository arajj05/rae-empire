const express = require('express');
const { redirectToQuickBooksLogin, handleCallback } = require('./auth/auth');  // Import the functions from auth.js
require('dotenv').config();  // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Step 1: Redirect to QuickBooks Login
app.get('/auth', redirectToQuickBooksLogin);

// Step 2: Handle Callback & Exchange Authorization Code for Tokens
app.get('/callback', handleCallback);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
