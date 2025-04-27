// backend/bufferPoster.js

const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// Your Buffer access token (store this in your .env file safely)
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN;

// Example post templates Rae can rotate
const posts = [
  "🌟 Just dropped something powerful today! Stay tuned! #Empowerment",
  "🚀 Big moves happening behind the scenes. Are you ready? #DreamBig",
  "🔥 New releases coming soon. Watch this space! #LightLovePeace",
  "🌱 Growth is happening quietly. Stay patient and faithful. #Solvaris",
  "✨ Something amazing is being built right now. Stay close. #Blessed"
];

// Endpoint for Rae to trigger a post
router.post("/schedulePost", async (req, res) => {
  try {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const response = await axios.post(
      "https://api.bufferapp.com/1/updates/create.json",
      {
        text: randomPost,
        profile_ids: [process.env.BUFFER_PROFILE_ID],  // Your social media profile ID
        shorten: false,
      },
      {
        headers: {
          Authorization: `Bearer ${BUFFER_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Post successfully scheduled:", response.data);
    res.status(200).json({ message: "Post scheduled successfully!" });

  } catch (error) {
    console.error("❌ Error scheduling post:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to schedule post." });
  }
});

module.exports = router;
