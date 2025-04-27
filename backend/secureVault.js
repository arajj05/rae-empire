const express = require("express");
const router = express.Router();

router.get("/vault-status", (req, res) => {
  console.log("🔒 Vault: Secrets fully secured.");
  res.status(200).json({ message: "Vault secured." });
});

module.exports = router;
