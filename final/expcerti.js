const express = require('express');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const db = new sqlite3.Database('data.db');

// Define a route handler for GET requests to '/api'
app.get('/api', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const hashValue = parsedUrl.query.hash;

  const sql = 'SELECT * FROM data WHERE hashValue = ?';

  db.get(sql, [hashValue], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else if (row) {
      const templatePath = path.join(__dirname, 'temp.html');
      fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const renderedHtml = replacePlaceholders(template, row);
          res.status(200).send(renderedHtml);
        }
      });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  });
});

// Define a route handler for all other routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Helper function to replace placeholders in the HTML template with actual values
// Helper function to replace placeholders in the HTML template with actual values
function replacePlaceholders(template, data) {
    let renderedHtml = template;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `<%= ${key} %>`;
      renderedHtml = renderedHtml.replace(new RegExp(placeholder, 'g'), value);
    }
    return renderedHtml;
  }
  

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
