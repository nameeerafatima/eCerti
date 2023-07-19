const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const crypto = require('crypto');

const app = express();

const startLink="https://localhost:3030/api?hash="

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        const jsonString = JSON.stringify(row);
        const hashValue = crypto.createHash('sha256').update(jsonString).digest('hex');
        // row['hashValue'] = hashValue;
        row['link'] = startLink+hashValue;
        console.log(startLink+hashValue);
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

