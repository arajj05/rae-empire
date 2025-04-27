const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const app = express();

// Use session middleware to store state
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Route that starts the OAuth flow
app.get('/start-oauth', (req, res) => {
    // Generate a random state parameter
    const state = crypto.randomBytes(16).toString('hex'); // Random string to use as state
    
    // Store the state in session (or database)
    req.session.state = state;

    // Construct the QuickBooks OAuth URL with the state
    const redirectUri = `https://appcenter.intuit.com/connect/oauth2?client_id=ABhhFcGAPNJlLY6A57KA78G8pRJoaMeCWUzIhVRAtn4kpA8gRO&redirect_uri=http://localhost:3000/callback&scope=com.intuit.quickbooks.accounting&response_type=code&state=${state}`;
    
    // Redirect the user to QuickBooks OAuth authorization page
    res.redirect(redirectUri);
});

// Callback route to handle QuickBooks response
app.get('/callback', (req, res) => {
    const { state, code } = req.query;

    // Check that the state in the callback matches the one stored in session
    if (state !== req.session.state) {
        return res.status(400).send('State mismatch error');
    }

    // Proceed with exchanging the authorization code for tokens
    // Use the `code` to get an access token (next step)

    res.send('OAuth flow completed successfully. Code received: ' + code);
});

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000');
});
const axios = require('axios');

// Inside the '/callback' route:
app.get('/callback', async (req, res) => {
    const { state, code } = req.query;

    // Verify the state parameter matches the stored state in session
    if (state !== req.session.state) {
        return res.status(400).send('State mismatch error');
    }

    try {
        // Exchange the authorization code for an access token
        const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(process.env.QB_CONSUMER_KEY + ':' + process.env.QB_CONSUMER_SECRET).toString('base64')}`,
            },
            params: {
                code: code,
                redirect_uri: 'http://localhost:3000/callback', // Same as the one used in the OAuth URL
                grant_type: 'authorization_code',
            }
        });

        const { access_token, refresh_token, realmId } = response.data;

        // Log or save the tokens and realm ID
        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);
        console.log('Realm ID:', realmId);

        // Store these values for later use
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        req.session.realmId = realmId;

        res.send('OAuth flow completed successfully!');
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Error exchanging code for token');
    }
});
