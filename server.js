const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// This single line automatically serves ALL files in the root folder:
// HTML, CSS, JS, images, etc.
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`✅ HeatIndex server running on port ${PORT}`);
});
