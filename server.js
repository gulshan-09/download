const express = require('express');
const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Fetch HTML endpoint
app.get('/fetch-html', async (req, res) => {
    let browser;

    try {
        // Set the Playwright browsers path to Vercel's environment
        process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, 'ms-playwright');

        // Launch a headless browser
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        const url = 'https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16';
        
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        if (!response || !response.ok()) {
            throw new Error(`Failed to load the page: ${response ? response.status() : 'No response'}`);
        }

        const content = await page.content(); // Get the full HTML content
        res.send(content); // Send the HTML content as response
    } catch (error) {
        console.error("Error fetching content:", error.message);
        res.status(500).json({ error: `Error fetching content: ${error.message}` });
    } finally {
        if (browser) await browser.close(); // Ensure the browser is closed
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
