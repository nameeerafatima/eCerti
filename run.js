const http = require('http');
const url = require('url');
const fs = require('fs');

// Read the JSON file
const jsonData = fs.readFileSync('data.json');
const data = JSON.parse(jsonData);

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Get data based on the provided hash value
  if (parsedUrl.pathname === '/api' && req.method === 'GET') {
    const hash = parsedUrl.query.hash;
    const result = data.find((item) => item.Hash === hash);

    if (result) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Data not found' }));
    }
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
