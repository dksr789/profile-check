const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Define the route for fetching user info
app.post('/api/request-info', async (req, res) => {
    const { username } = req.body; // Get the username from the request body
    const payload = { username };

    try {
        // First request to get user info
        const response = await axios.post('https://tapi.twicsy.com/api/v1/info', payload, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Origin': 'https://twicsy.com',
                'Referer': 'https://twicsy.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            }
        });

        // Send the user info back to the client
        res.json(response.data);

    } catch (error) {
        console.error('Error making request:', error);
        res.status(500).send('Error making request');
    }
});

// Proxy image fetching
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url; // Get the image URL from the query parameter
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer', // To handle binary data
        });
        res.set('Content-Type', response.headers['content-type']); // Set the correct content type
        res.send(response.data); // Send the image data
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Error fetching image');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
