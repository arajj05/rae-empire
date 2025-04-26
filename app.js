const express = require('express'); // Require express
const crypto = require('crypto');
const session = require('express-session');

// Initialize the express app
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

// Route to handle QuickBooks OAuth callback
app.get('/callback', (req, res) => {
    // Retrieve the state from the query string
    const receivedState = req.query.state;

    // Retrieve the expected state from the session (or database)
    const expectedState = req.session.state;

    // Compare the received state with the expected state
    if (receivedState !== expectedState) {
        return res.status(400).send('State mismatch');
    }

    // If states match, proceed with token exchange
    const authorizationCode = req.query.code;

    // You can now use the authorization code to get an access token
    // (You'll need to make another API call to QuickBooks for this step)
    res.send('State matches, proceed with token exchange');
});

// Start the server
app.listen(3000, () => {
    console.log('App is running on http://localhost:3000');
});
app.listen(3000, '0.0.0.0', () => {
    console.log('App is running on http://localhost:3000');
});
