const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env
const session = require("express-session"); // For state management

const app = express();
const PORT = 3000; // Explicitly set to port 3000

// Set up session middleware to store state
app.use(session({
  secret: 'your-session-secret', // Replace with a secret
  resave: false,
  saveUninitialized: true,
}));

app.use(cors());
app.use(express.json());

// Routes
const quickbooksAuth = require("./quickbooksAuth");
const callbackServer = require("./callbackServer");

app.use("/auth", quickbooksAuth); // Redirect to QuickBooks for OAuth
app.use("/callback", callbackServer); // Token exchange after OAuth authorization

// Default route for testing
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
