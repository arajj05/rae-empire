const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const app = express();

// Use session middleware to store state
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Route that starts the OAuth flow
app.get('/start-oauth', (req, res) => {
    // Generate a random state parameter
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store the state in session (or database)
    req.session.state = state;

    // Construct the QuickBooks OAuth URL with the state
    const redirectUri = `https://appcenter.intuit.com/connect/oauth2?client_id=your-client-id&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri=http://localhost:3000/callback&state=${state}`;
    
    // Redirect the user to QuickBooks OAuth authorization page
    res.redirect(redirectUri);
});

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000');
});
