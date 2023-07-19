const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('new_database.db');

const tableNames = ['Sheet1', 'Sheet2']; // Add the names of your tables here

tableNames.forEach((tableName) => {
  const query = `SELECT * FROM ${tableName};`;

  db.all(query, function (err, rows) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Data from table "${tableName}":`);
      rows.forEach((row) => {
        console.log(row);
      });
    }
  });
});

db.close();
