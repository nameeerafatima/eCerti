// const http = require('http');
// const url = require('url');
// const sqlite3 = require('sqlite3').verbose();

// // Create a new SQLite database connection
// const db = new sqlite3.Database('database.db');
// // let n=document.getElementById("stname")

// // Create the server
// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);

//   // Get data based on the provided hash value
//   if (parsedUrl.pathname === '/api' && req.method === 'GET') {
//     const hash = parsedUrl.query.hash;
    
//     // Prepare the SQL query
//     const sql = 'SELECT * FROM sheet WHERE Hash = ?';

//     // Execute the query with the provided hash value
//   db.get(sql, [hash], (err, row) => {
//   if (err) {
//     console.error(err); // Log the error
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Internal Server Error' }));
//   } else if (row) {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify(row));
//     console.log(row.name);
//   } else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Data not found' }));
//   }
// });

//   }
//   // Handle other routes
//   else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Route not found' }));
//   }
// });

// // Start the server
// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// FOR CHANING THE LINK
// const http = require('http');
// const url = require('url');
// const sqlite3 = require('sqlite3').verbose();

// // Create a new SQLite database connection
// const db = new sqlite3.Database('database.db');

// // Create the server
// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);

//   // Get data based on the provided hash value
//   if (parsedUrl.pathname === '/api' && req.method === 'GET') {
//     const hash = parsedUrl.query.hash;
    
//     // Prepare the SQL query
//     const sql = 'SELECT * FROM sheet WHERE Hash = ?';

//     // Execute the query with the provided hash value
//     db.get(sql, [hash], (err, row) => {
//       if (err) {
//         console.error(err); // Log the error
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Internal Server Error' }));
//       } else if (row) {
//         const name = row.name; // Extract the 'Name' property from 'row'
//         res.writeHead(302, { 'Location': `certificate.html?name=${name}` });
//         res.end();
//       } else {
//         res.writeHead(404, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Data not found' }));
//       }
//     });
//   }
//   // Handle other routes
//   else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Route not found' }));
//   }
// });

// // Start the server
// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const http = require('http');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');
const fs = require('fs');

// Create a new SQLite database connection
const db = new sqlite3.Database('database.db');

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Get data based on the provided hash value
  if (parsedUrl.pathname === '/api' && req.method === 'GET') {
    const hash = parsedUrl.query.hash;
    
    // Prepare the SQL query
    const sql = 'SELECT * FROM sheet WHERE Hash = ?';

    // Execute the query with the provided hash value
    db.get(sql, [hash], (err, row) => {
      if (err) {
        console.error(err); // Log the error
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
      } else if (row) {
        // Read the HTML template file
        fs.readFile('certificate.html', 'utf8', (err, template) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
          } else {
            // Render the template with the retrieved data
            const renderedHtml = ejs.render(template, { name: row.name });
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderedHtml);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Data not found' }));
      }
    });
  }
  // Handle other routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
