// backend/paymentWebhook.js

const express = require("express");
const router = express.Router();
require("dotenv").config();

// Webhook endpoint for payment notifications
router.post("/paymentWebhook", async (req, res) => {
  try {
    const paymentData = req.body;

    console.log("💸 New Payment Received:", paymentData);

    // Example: Check if payment is complete
    if (paymentData.status === "COMPLETED" || paymentData.event_type === "PAYMENT.SALE.COMPLETED") {
      console.log(`✅ Payment confirmed from ${paymentData.payer_email || "unknown payer"}`);

      // Here you would trigger product delivery, add to customer list, etc.
      // For now we just log it.

      res.status(200).json({ message: "Payment processed successfully." });
    } else {
      console.log("⚠️ Payment not completed yet or unknown event type.");
      res.status(200).json({ message: "Payment received but not completed." });
    }

  } catch (error) {
    console.error("❌ Error handling payment webhook:", error.message);
    res.status(500).json({ error: "Failed to process payment webhook." });
  }
});

module.exports = router;
