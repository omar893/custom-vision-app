const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/predict', (req, res) => {
  const process = spawn('node', ['custom-vision-script.js']);

  let data = '';

  process.stdout.on('data', (chunk) => {
    data += chunk;
  });

  process.on('close', () => {
    try {
      const results = JSON.parse(data);
      res.json(results);
    } catch (error) {
      console.error('Error parsing prediction results:', error);
      res.status(500).json({ error: 'An error occurred while fetching prediction results.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
