// server.js - Minimal Express server for HTML files
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve all static files (CSS, JS, images, HTML) from root folder
app.use(express.static(path.join(__dirname)));

// Handle requests for .html files explicitly
app.get('*.html', (req, res) => {
  const fileName = req.path.substring(1); // Remove leading "/"
  res.sendFile(path.join(__dirname, fileName));
});

// Root route: serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ HeatIndex server running on port ${PORT}`);
});
