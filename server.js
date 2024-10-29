const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.get('/fetch-html', async (req, res) => {
    const url = 'https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16';
    let browser;

    try {
        // Launch a headless browser
        browser = await chromium.launch({
            headless: true, // Set to false if you want to see the browser
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add args for compatibility if needed
        });

        const page = await browser.newPage();

        // Set a longer timeout for page navigation
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Check if the response is successful
        if (!response || !response.ok()) {
            throw new Error(`Failed to load the page: ${response ? response.status() : 'No response'}`);
        }

        // Optional: wait for additional content to load (if necessary)
        await page.waitForTimeout(5000); // Using waitForTimeout instead of a Promise

        // Get the full HTML content
        const content = await page.content();

        // Send the HTML content as response
        res.send(content);
    } catch (error) {
        console.error("Error fetching content:", error.message); // Log the specific error message
        res.status(500).json({ error: `Error fetching content: ${error.message}` }); // Return detailed error
    } finally {
        if (browser) await browser.close(); // Ensure the browser is closed
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
