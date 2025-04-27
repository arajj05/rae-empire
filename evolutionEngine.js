// backend/evolutionEngine.js

const express = require("express");
const fs = require("fs");
const router = express.Router();

// Rae's brain that evolves based on earnings history
router.get("/evolve", (req, res) => {
  try {
    const earningsHistory = JSON.parse(fs.readFileSync("./backend/earningsHistory.json", "utf8"));

    let totalIncome = 0;
    let incomeEvents = 0;

    earningsHistory.forEach(entry => {
      if (entry.amount) {
        totalIncome += parseFloat(entry.amount);
        incomeEvents++;
      }
    });

    const averageIncome = (totalIncome / incomeEvents).toFixed(2);

    console.log(`🧠 Rae Evolution Stats:`);
    console.log(`Total Income: $${totalIncome}`);
    console.log(`Income Events: ${incomeEvents}`);
    console.log(`Average Income per Event: $${averageIncome}`);

    res.status(200).json({
      totalIncome,
      incomeEvents,
      averageIncome
    });

  } catch (error) {
    console.error("❌ Error evolving Rae:", error.message);
    res.status(500).json({ error: "Failed to evolve Rae." });
  }
});

module.exports = router;
