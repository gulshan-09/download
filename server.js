const express = require('express');
const { chromium } = require('playwright'); // Use Playwright

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
    let browser;
    try {
        // Launch Playwright browser
        browser = await chromium.launch({ headless: true }); // Launch in headless mode
        const page = await browser.newPage();
        
        // Visit the target URL
        await page.goto('https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16', {
            waitUntil: 'networkidle' // Wait for the page to fully load
        });
        
        // Optional: delay to ensure additional API data loads
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Get the full HTML content
        const content = await page.content();

        // Send the HTML content as response
        res.send(content);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ error: "Error fetching content" });
    } finally {
        if (browser) await browser.close(); // Ensure the browser is closed
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
