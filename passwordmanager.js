const passwordManager = require('./passwordManager');
const crypto = require('crypto');
const fs = require('fs');

// Encryption settings
const algorithm = 'aes-256-cbc';
const secretKey = 'yourSecretKey'; // Use a strong secret key
const iv = crypto.randomBytes(16);

// Function to encrypt data
function encryptData(data) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Function to decrypt data
function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(encryptedData.iv, 'hex'));
  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

// Function to save passwords securely
function savePasswords(passwords) {
  const encryptedPasswords = encryptData(JSON.stringify(passwords));
  fs.writeFileSync('encryptedPasswords.txt', JSON.stringify(encryptedPasswords));
  console.log('Passwords saved securely');
}

// Function to load decrypted passwords
function loadPasswords() {
  const encryptedPasswords = JSON.parse(fs.readFileSync('encryptedPasswords.txt', 'utf8'));
  const decrypted = decryptData(encryptedPasswords);
  return JSON.parse(decrypted);
}

// Expose the functions to be used in other files
module.exports = { savePasswords, loadPasswords };
