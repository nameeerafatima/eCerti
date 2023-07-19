const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('new_database.db');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

Object.keys(data).forEach((sheetName) => {
  const sheetData = data[sheetName];

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${sheetName} (
      Name TEXT,
      Age INTEGER,
      Email TEXT,
      Hash TEXT
    );
  `;

  db.run(createTableQuery, function (error) {
    if (error) {
      console.error(error.message);
    } else {
      console.log(`Table "${sheetName}" created successfully`);

      sheetData.forEach((row) => {
        const insertQuery = `
          INSERT INTO ${sheetName} (Name, Age, Email, Hash)
          VALUES ('${row.Name}', ${row.Age}, '${row.Email}', '${row.Hash}');
        `;

        db.run(insertQuery, function (error) {
          if (error) {
            console.error(error.message);
          } else {
            console.log(`Row inserted successfully into "${sheetName}"`);
          }
        });
      });
    }
  });
});
db.close();
console.log("Closing the connecting and opennig a new one")


// DISPLAY THE NEW DATABASE INFO
const db1 = new sqlite3.Database('new_database.db');
db1.all("SELECT name FROM sqlite_master WHERE type='table';", function(err, tables) {
  if (err) {
    console.error(err.message);
    db1.close();
    return;
  }

  tables.forEach((table) => {
    const tableName = table.name;
    const query = `SELECT * FROM ${tableName};`;

    db1.all(query, function (err, rows) {
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

  db1.close();
});

