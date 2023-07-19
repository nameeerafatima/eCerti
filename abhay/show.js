const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

const query = 'SELECT * FROM data;';

db.all(query, function (err, rows) {
  if (err) {
    console.error(err.message);
  } else {
    console.log(rows);
  }
});

db.close();

