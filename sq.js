const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read the JSON file
const jsonData = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(jsonData);

// Open the SQLite database
const db = new sqlite3.Database('database.db');

// Insert JSON data into the database
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)');

  const insertStmt = db.prepare('INSERT INTO data (id, name, age) VALUES (?, ?, ?)');
  data.forEach((record) => {
    insertStmt.run(record.id, record.name, record.age);
  });
  insertStmt.finalize();
});

// Close the database connection
db.close();
