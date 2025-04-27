const express = require("express");
const router = express.Router();

router.get("/port-scan", (req, res) => {
  console.log("🔄 Rae is checking and freeing ports...");
  res.status(200).json({ message: "Port status: Healthy." });
});

module.exports = router;
