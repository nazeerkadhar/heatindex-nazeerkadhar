const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;
const PUBLIC_DIR = path.resolve(__dirname);

// Serve static files (CSS, JS, images, HTML files by name)
app.use(express.static(PUBLIC_DIR));

// CRITICAL: Explicitly serve index.html for root URL "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Fallback: Serve any .html file if requested directly
app.get('*.html', (req, res) => {
  const file = req.path.substring(1); // Remove leading "/"
  const filePath = path.join(PUBLIC_DIR, file);
  res.sendFile(filePath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
