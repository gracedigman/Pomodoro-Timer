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

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// API endpoint to get a random quote from ZenQuotes
app.get("/api/quote", async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quote = {
      content: response.data[0].q,
      author: response.data[0].a
    };
    res.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    res.json({
      content: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the Pomodoro timer`);
});