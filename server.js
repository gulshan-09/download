// api/fetch-html.js
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get('/fetch-html', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://s3taku.com/download?id=MjM2MTM2&typesub=Gogoanime-SUB&title=Tasuuketsu+Episode+16');

        // 5 seconds delay for page load
        await new Promise(resolve => setTimeout(resolve, 5000));
        const content = await page.content();

        await browser.close();

        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = app;
