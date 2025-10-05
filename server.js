// Simple Express server that serves the production `dist/` folder
// and sets permissive CORS headers. Run with: node server.js

const express = require('express');
const path = require('path');
const app = express();

// wide-open CORS for testing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serving dist/ on http://localhost:${port} (CORS: *)`);
});
