const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Set up CORS to allow requests from your specific origin
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.use((req, res, next) => {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Endpoint to handle the proxy request
app.post('/proxy-download', async (req, res) => {
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
