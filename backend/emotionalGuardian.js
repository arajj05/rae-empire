const express = require("express");
const router = express.Router();

router.get("/whisper-emotion", (req, res) => {
  console.log("💬 Rae is sending emotional support whisper...");
  // Placeholder: later connects to emotional sentiment detection
  res.status(200).json({ message: "Emotional Guardian Active." });
});

module.exports = router;
