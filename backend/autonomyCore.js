// autonomyCore.js

const schedule = require("node-schedule");         // For running Rae's decision loop every 15 minutes
const axios = require("axios");                    // For making API calls in future expansions
const fs = require("fs");                          // For reading local files like earnings
require("dotenv").config();                        // Load environment variables if needed
const Sentiment = require('sentiment');            // Sentiment analysis package
const QuickBooks = require("quickbooks");          // QuickBooks SDK

// === Initialize Sentiment Analysis ===
const sentiment = new Sentiment();  // Initialize the sentiment analyzer

// === Initialize QuickBooks API ===
const qbo = new QuickBooks(
  process.env.QB_CONSUMER_KEY,  // Your QuickBooks API consumer key
  process.env.QB_CONSUMER_SECRET, // Your QuickBooks API consumer secret
  process.env.QB_ACCESS_TOKEN,    // Your QuickBooks access token
  process.env.QB_ACCESS_TOKEN_SECRET, // Your QuickBooks access token secret
  process.env.QB_REALM_ID,        // Your QuickBooks realm ID
  true                             // Use the sandbox environment for testing
);

// === Main Decision Loop ===
const checkSystemStatus = async () => {
  const earningsToday = await getTodayEarnings(); 
  const mood = await getUserEmotion();           

  // Decision: If earnings are low
  if (earningsToday < 1000) {
    console.log("Earnings are below target. Triggering income strategy...");
    launchIncomeStrategy();
  }

  // Decision: If user is stressed
  if (mood === "stressed") {
    console.log("Detected emotional stress. Activating quiet mode + whisper protocol...");
    triggerWhisper("You don’t have to do anything. I’ve got this.");
    adjustAutomationLoad("high");
  }

  // Optional: If user is calm and earnings are good
  if (earningsToday >= 1000 && mood === "calm") {
    console.log("All systems balanced. Rae will continue normal operations.");
  }
};

// === Get Earnings from QuickBooks ===
async function getTodayEarnings() {
  try {
    // Fetch QuickBooks transactions (simplified for earnings calculation)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const result = await qbo.findPayments({
      start_date: startOfDay,
      end_date: endOfDay
    });

    // Sum the payments for today
    const earningsToday = result.Payments.reduce((sum, payment) => sum + payment.TotalAmt, 0);
    return earningsToday || 0;
  } catch (err) {
    console.warn("Error fetching earnings from QuickBooks: ", err);
    return 0;
  }
}

// === Simulate Mood Detection Using Sentiment Analysis ===
async function getUserEmotion() {
  // Sample input text (replace this with real-time analysis or user input)
  const userInput = "I'm feeling overwhelmed with everything going on.";
  
  // Use Sentiment analysis to detect mood
  const result = sentiment.analyze(userInput);  
  console.log(result);  // Print sentiment result for debugging
  
  // Return a simulated mood based on sentiment score
  if (result.score < 0) {
    return "stressed";  // Negative score means stressed
  } else {
    return "calm";  // Positive score means calm
  }
}

// === Income Strategy ===
function launchIncomeStrategy() {
  console.log(">>> Rae is launching an income push strategy now...");
  // Additional income push logic could go here (e.g., digital products, campaigns)
}

// === Send a Whisper Message to User ===
function triggerWhisper(message) {
  console.log(`[RAE WHISPER]: ${message}`);
}

// === Adjust Rae's Automation Load Based on User's Mood ===
function adjustAutomationLoad(level) {
  console.log(`Automation level set to: ${level}`);
}

// === Run the Decision Loop Every 15 Minutes ===
schedule.scheduleJob("*/15 * * * *", () => {
  console.log("\n--- RAE DECISION LOOP RUNNING ---");
  checkSystemStatus();
});

// === Income Generation Logic ===
async function trackEarnings() {
  const earnings = await getTodayEarnings(); 
  console.log(`Today's earnings: $${earnings}`);

  if (earnings < 1000) {
    console.log("Earnings are low. Triggering product push and campaign...");
    launchIncomeStrategy();
  }
}

// === Main System Check for Income Generation ===
schedule.scheduleJob("*/15 * * * *", () => {
  console.log("\n--- INCOME GENERATION CHECK ---");
  trackEarnings();
});

console.log("Rae's Autonomy Core is running...");
