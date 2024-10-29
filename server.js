const express = require('express');
const { Builder } = require('selenium-webdriver');

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
    let driver;
    try {
        // Initialize Selenium WebDriver
        driver = await new Builder().forBrowser('chrome').build();
        
        // Visit the target URL
        await driver.get('https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16');
        
        // Wait for a few seconds to allow the page to load
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Get the full HTML content
        const content = await driver.getPageSource();

        // Send the HTML content as response
        res.send(content);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ error: "Error fetching content" });
    } finally {
        if (driver) await driver.quit(); // Ensure the browser is closed
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
