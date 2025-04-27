// backend/autoDelivery.js

const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or use another service like Outlook, etc.
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Endpoint to deliver product after payment
router.post("/deliverProduct", async (req, res) => {
  try {
    const { customerEmail, productName, productLink } = req.body;

    if (!customerEmail || !productName || !productLink) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const mailOptions = {
      from: `"Solvaris Publishing" <${process.env.EMAIL_USERNAME}>`,
      to: customerEmail,
      subject: `Your Purchase: ${productName}`,
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Here is your product: <strong>${productName}</strong></p>
        <p><a href="${productLink}" target="_blank">Download Here</a></p>
        <p>We appreciate your business. Enjoy!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Product "${productName}" sent to ${customerEmail}`);
    res.status(200).json({ message: "Product delivered successfully." });

  } catch (error) {
    console.error("❌ Error delivering product:", error.message);
    res.status(500).json({ error: "Failed to deliver product." });
  }
});

module.exports = router;
