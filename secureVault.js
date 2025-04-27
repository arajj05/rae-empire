// backend/secureVault.js

const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const router = express.Router();
require("dotenv").config();

// Encryption key (store securely in .env)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// Encrypt sensitive data
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decrypt sensitive data
function decrypt(text) {
  let parts = text.split(":");
  let iv = Buffer.from(parts.shift(), "hex");
  let encryptedText = Buffer.from(parts.join(":"), "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Securely save data
router.post("/saveSecure", (req, res) => {
  try {
    const { dataName, dataValue } = req.body;

    const encryptedData = encrypt(dataValue);
    fs.writeFileSync(`./secure/${dataName}.vault`, encryptedData);

    console.log(`🔒 Securely saved: ${dataName}`);
    res.status(200).json({ message: "Data saved securely." });

  } catch (error) {
    console.error("❌ Error saving secure data:", error.message);
    res.status(500).json({ error: "Failed to save data securely." });
  }
});

// Retrieve secure data
router.post("/loadSecure", (req, res) => {
  try {
    const { dataName } = req.body;
    const encryptedData = fs.readFileSync(`./secure/${dataName}.vault`, "utf8");
    const decryptedData = decrypt(encryptedData);

    console.log(`🔓 Secure data loaded: ${dataName}`);
    res.status(200).json({ data: decryptedData });

  } catch (error) {
    console.error("❌ Error loading secure data:", error.message);
    res.status(500).json({ error: "Failed to load secure data." });
  }
});

module.exports = router;
