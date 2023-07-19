const fs = require('fs');
const crypto = require('crypto');

function calculateSHA256Hash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

fs.readFile('data.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(jsonString);

    for (const sheetName in jsonData) {
      if (jsonData.hasOwnProperty(sheetName)) {
        const sheetData = jsonData[sheetName];

        const updatedData = sheetData.map((person) => {
          const { Name, Age, Email } = person;
          const combinedString = `${Name}${Age}${Email}`;
          console.log(combinedString);
          const hash = calculateSHA256Hash(combinedString);

          return { ...person, Hash: hash };
        });

        jsonData[sheetName] = updatedData;
      }
    }

    const updatedJsonString = JSON.stringify(jsonData, null, 2);

    fs.writeFile('data.json', updatedJsonString, (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return;
      }
      console.log('JSON file has been updated successfully.');
    });
  } catch (err) {
    console.error('Error parsing JSON data:', err);
  }
});
