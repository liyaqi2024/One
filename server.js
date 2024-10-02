const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware to serve static files
app.use(express.static(path.join(__dirname))); // Serve main HTML and CSS first
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'songs')));
app.use(express.static(path.join(__dirname, 'lyrics')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
