// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 or fallback to environment variable

app.use(cors());
app.use(express.json());

// Import and use routes
const quickbooksAuth = require("./backend/quickbooksAuth");
app.use("/auth", quickbooksAuth); // Ensure the correct path for authorization

const callbackServer = require("./backend/callbackServer");
app.use("/callback", callbackServer); // Handle the callback route

// Default route for testing
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
