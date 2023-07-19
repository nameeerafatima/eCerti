const fs = require('fs');

// Read the JSON file
const jsonData = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(jsonData);
console.log(data);


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// Create a table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS poeple (
    name TEXT,
    age INTEGER,
    email TEXT,
    hash TEXT
)`);

//Priting info
// Define the SELECT query
const selectQuery = 'SELECT * FROM people;';

// Execute the SELECT query
db.all(selectQuery, function (err, rows) {
  if (err) {
    console.error(err.message);
  } else {
    // Print the retrieved data
    rows.forEach((row) => {
      console.log(row);
    });
  }
});

// Close the database connection
db.close();

