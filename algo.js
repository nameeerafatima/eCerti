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

    // Iterate over each sheet
    for (const sheetName in jsonData) {
      if (jsonData.hasOwnProperty(sheetName)) {
        const sheetData = jsonData[sheetName];
        for (const person of sheetData) {
            const { Name, Age, Email } = person;
            const combinedString = `${Name}${Age}${Email}`;
            console.log(combinedString);
            const hash = calculateSHA256Hash(combinedString);
            console.log(`SHA-256 hash for ${sheetName} - ${Name}:`, hash);
            
        }         
      }
    }
  } catch (err) {
    console.error('Error parsing JSON data:', err);
  }
});
