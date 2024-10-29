import express from 'express';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetch-html', async (req, res) => {
    let browser = null;
    try {
        // Puppeteer launch configuration with chrome-aws-lambda
        browser = await puppeteer.launch({
            args: [...chrome.args, '--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: await chrome.executablePath || '/usr/bin/chromium-browser',
            headless: chrome.headless
        });
        
        const page = await browser.newPage();
        await page.goto('https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16', {
            waitUntil: 'networkidle2'
        });

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Get the page content
        const content = await page.content();

        // Send content as JSON response
        res.json({ content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.toString() });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
