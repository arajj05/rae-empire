const crypto = require('crypto');
const fs = require('fs');

// Encryption settings
const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(String('yourSuperSecretKeyHere')).digest('base64').substr(0, 32); // Strong key
const iv = crypto.randomBytes(16);

// Function to encrypt data
function encryptData(data) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Function to decrypt data
function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(encryptedData.iv, 'hex')
  );
  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Function to save passwords securely
function savePasswords(passwords) {
  const encryptedPasswords = encryptData(JSON.stringify(passwords));
  fs.writeFileSync('./secure/encryptedPasswords.txt', JSON.stringify(encryptedPasswords));
  console.log('🔒 Passwords saved securely.');
}

// Function to load decrypted passwords
function loadPasswords() {
  const encryptedPasswords = JSON.parse(fs.readFileSync('./secure/encryptedPasswords.txt', 'utf8'));
  const decrypted = decryptData(encryptedPasswords);
  return JSON.parse(decrypted);
}

module.exports = { savePasswords, loadPasswords };
