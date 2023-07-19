const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const startLink = "https://localhost:3000/api?hash=";

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create SQLite database connection
const db = new sqlite3.Database('data.db');

// Create the "data" table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS data (
    sno INTEGER,
    rollno TEXT,
    name TEXT,
    domain TEXT,
    title TEXT,
    mentor TEXT,
    duration TEXT,
    completion DATE,
    hashValue TEXT
  )
`);

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle the file upload and conversion
app.post('/upload', upload.single('excelFile'), (req, res) => {
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  // Generate and add unique hash values (using sha256) as a new column
  jsonData.forEach((row) => {
    console.log(row);

    // Coz the date format is changing
    const rawDate = row['Date of Completion'];
    const completionDate = new Date(rawDate);
    const formattedDate = completionDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    row['Date of Completion'] = formattedDate;
    

    const combinedString = row['S.No']+row['Roll Number']+ row['Name']+ row['Domain'] +row['Project Title']+row['Mentor']+row['Duration (months)']+row['Date of Completion'];
    console.log(combinedString);
    const hashValue = crypto.createHash('sha256').update(combinedString).digest('hex');
    row['link'] = startLink + hashValue;
    const { sno, rollno ,name ,domain,title,mentor,duration,completion } = row;

    // Check if the row with the same hash value already exists in the database
    db.get('SELECT * FROM data WHERE hashValue = ?', [hashValue], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!result) {
      
        // Insert the row data into the database if it doesn't exist
        db.run('INSERT INTO data (sno, rollno ,name ,domain,title,mentor,duration,completion,hashValue) VALUES (?, ?, ?, ?,?,?,?,?,?)',
          [sno ,rollno ,name ,domain,title,mentor,duration,completion,hashValue], (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
      }
    });
  });

  // Convert JSON data back to an Excel workbook
  const updatedWorksheet = xlsx.utils.json_to_sheet(jsonData);
  const updatedWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(updatedWorkbook, updatedWorksheet);

  // Set the content type and header for downloading the file
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="updated_excel.xlsx"');

  // Send the updated Excel file as a response
  res.send(xlsx.write(updatedWorkbook, { type: 'buffer' }));
});

const port = 3030;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
