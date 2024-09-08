const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the HTML file directly from the root folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get the JSON data
app.get('/get-data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        const jsonData = JSON.parse(data || '{"data": []}');
        res.json(jsonData.data); // Send the "data" array
    });
});

// Route to add new data to JSON
app.post('/add-data', (req, res) => {
    const newData = req.body;

    // Read the current data
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        const jsonData = JSON.parse(data || '{"data": []}');
        jsonData.data.push(newData);

        // Write the updated data back to the file
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Failed to update data' });
            }

            res.status(200).json({ message: 'Data added successfully' });
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
