const express = require('express');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('data.db');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define a route handler for GET requests to '/api'
app.get('/api', (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const hashValue = parsedUrl.query.hash;

  const sql = 'SELECT * FROM data WHERE hashValue = ?';

  // ...
db.get(sql, [hashValue], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else if (row) {
      fs.readFile('temp.html', 'utf8', (err, template) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const data = {
            SNo: row['S.No'],
            RollNumber: row['Roll Number'],
            Name: row.Name,
            Domain: row.Domain,
            ProjectTitle: row['Project Title'],
            Mentor: row.Mentor,
            Duration: row['Duration (months)'],
            CompletionDate: row['Date of Completion']
          };
          const renderedHtml = ejs.render(template, data);
          res.status(200).send(renderedHtml);
        }
      });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  });
  // ...
  
});

// Define a route handler for all other routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
