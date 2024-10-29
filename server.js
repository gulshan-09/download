const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const express = require('express');
const app = express();

app.get('/fetch-html', async (req, res) => {
    let browser = null;
    try {
        // Puppeteer ko lambda-compatible launch options ke sath configure karein
        browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });
        const page = await browser.newPage();
        await page.goto('https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16', {
            waitUntil: 'networkidle2'
        });

        // Wait for the content to load
        await new Promise(resolve => setTimeout(resolve, 5000));
        const content = await page.content();

        await browser.close();

        res.json({ content });
    } catch (error) {
        if (browser) await browser.close();
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = app;
