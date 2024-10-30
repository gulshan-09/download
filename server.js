const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Set up CORS to allow requests from your specific origin
app.use(cors({
    origin: 'https://anikoto.fun', // Replace with your client domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Proxy endpoint to handle the request
app.post('/proxy-download', async (req, res) => {
    // Set CORS headers explicitly for this endpoint
    res.setHeader("Access-Control-Allow-Origin", "https://anikoto.fun"); // Set to your domain
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    const { captcha_v3, id } = req.body;

    try {
        // Make the request to the original API endpoint
        const response = await axios.post('https://s3taku.com/download', {
            captcha_v3,
            id
        });

        // Send the API response back to the client
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
