const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// CRITICAL: Use path.resolve for absolute path that works on Render
const PUBLIC_DIR = path.resolve(__dirname);

// Serve static files from the resolved public directory
app.use(express.static(PUBLIC_DIR));

// Fallback: Explicitly handle .html files (in case static middleware misses)
app.get('*.html', (req, res) => {
  const file = req.path.substring(1); // Remove leading slash
  const filePath = path.join(PUBLIC_DIR, file);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`❌ Error sending file ${file}:`, err.message);
      res.status(404).send('File not found: ' + file);
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving files from: ${PUBLIC_DIR}`);
});
