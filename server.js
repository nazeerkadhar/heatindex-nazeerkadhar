const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// Serve ALL files from the folder where server.js lives
app.use(express.static(path.join(__dirname)));

// Explicitly handle root URL "/" → serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Server running');
});
