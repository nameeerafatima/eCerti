const fs = require('fs');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

function calculateSHA256Hash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

// Read the JSON file
fs.readFile('data.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(jsonString);

    // Add hash values to the JSON data
    const updatedData = jsonData.map((person) => {
      const { Name, Age, Email } = person;
      const combinedString = `${Name}${Age}${Email}`;
      const hash = calculateSHA256Hash(combinedString);

      return { ...person, Hash: hash };
    });

    const updatedJsonString = JSON.stringify(updatedData, null, 2);

    // Write updated JSON data back to file
    fs.writeFile('data.json', updatedJsonString, (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return;
      }
      console.log('JSON file has been updated successfully.');

      // Open database connection
      const db = new sqlite3.Database('database.db');

      // Create table if it doesn't exist
      const createTableQuery = `CREATE TABLE IF NOT EXISTS sheet (
        name TEXT,
        age INTEGER,
        email TEXT,
        hash TEXT
      )`;

      db.run(createTableQuery, function (createErr) {
        if (createErr) {
          console.error('Error creating table:', createErr.message);
          db.close();
          return;
        }

        // Insert data into the table
        updatedData.forEach((person) => {
          const { Name, Age, Email, Hash } = person;
          const insertQuery = `INSERT INTO sheet (name, age, email, hash)
                               VALUES (?, ?, ?, ?)`;

          db.run(insertQuery, [Name, Age, Email, Hash], function (insertErr) {
            if (insertErr) {
              console.error('Error inserting data into table:', insertErr.message);
            }
          });
        });

        // Print data from the table
        const selectQuery = 'SELECT * FROM sheet';
        db.all(selectQuery, function (selectErr, rows) {
          if (selectErr) {
            console.error('Error retrieving data from table:', selectErr.message);
          } else {
            rows.forEach((row) => {
              console.log(row);
            });
          }

          // Close the database connection
          db.close();
        });
      });
    });
  } catch (err) {
    console.error('Error parsing JSON data:', err);
  }
});
