const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Example of how you might track earnings; replace with your actual logic
let earnings = 50000; // This could come from QuickBooks or your database

// API route to fetch earnings data
app.get('/api/earnings', (req, res) => {
  res.json({ total: earnings });  // Sends the current earnings to the frontend
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
