import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetch-html', async (req, res) => {
    let browser = null;
    try {
        // Launch Puppeteer with Sparticuz's Chromium path and args
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto('https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16', {
            waitUntil: 'networkidle2',
        });

        await page.waitForTimeout(5000); // Wait for 5 seconds

        const content = await page.content();
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
