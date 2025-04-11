const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Store multiple quotes in memory
let quoteCache = [];

// Function to refresh the quote cache
async function refreshQuoteCache() {
  try {
    // Fetch 10 different quotes
    const response = await axios.get("https://api.quotable.io/quotes/random?limit=10&tags=inspirational,motivational");
    quoteCache = response.data;
    console.log("Quote cache refreshed with 10 new quotes");
  } catch (error) {
    console.error("Error refreshing quote cache:", error.message);
    // If we can't fetch from the API, add some default quotes
    if (quoteCache.length === 0) {
      quoteCache = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { content: "Quality is not an act, it is a habit.", author: "Aristotle" },
        { content: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
        { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
      ];
    }
  }
}

// Initial quote fetch when server starts
refreshQuoteCache();

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// API endpoint to get a random quote
app.get("/api/quote", (req, res) => {
  if (quoteCache.length > 0) {
    // Get a random quote from our cache
    const randomIndex = Math.floor(Math.random() * quoteCache.length);
    const quote = quoteCache[randomIndex];
    
    // Remove the quote to avoid repetition until cache refresh
    quoteCache.splice(randomIndex, 1);
    
    // If we're running low on quotes, refresh the cache
    if (quoteCache.length <= 2) {
      refreshQuoteCache();
    }
    
    res.json(quote);
  } else {
    // If cache is empty, return a default quote
    res.json({
      content: "The best way to predict the future is to create it.",
      author: "Peter Drucker"
    });
    
    // Try to refresh the cache
    refreshQuoteCache();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the Pomodoro timer`);
});