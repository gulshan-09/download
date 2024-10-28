const express = require('express');
const app = express();
const router = express.Router();
require("dotenv").config();
const cors = require('cors');
const puppeteer = require('puppeteer');

const PORT = process.env.PORT || "5001";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json("It's working.😉😎");
});

async function fetchHtmlContent(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // Increase timeout
        await page.waitForSelector('.mirror_link', { timeout: 15000 });

        const downloadLinks = await page.evaluate(() => {
            const links = {};
            const downloadDivs = document.querySelectorAll('.mirror_link .dowload a');
            
            downloadDivs.forEach(link => {
                const qualityText = link.textContent.trim().replace(/Download\s*\((.*?)\s*-.*\)/, '$1');
                const url = link.href;
                links[qualityText] = url;
            });

            return links;
        });

        return downloadLinks;
    } catch (error) {
        console.error('Error during page processing:', error);
        throw new Error('Failed to fetch content'); // Throw a specific error
    } finally {
        await browser.close(); // Ensure browser closes even on error
    }
}

router.get('/download', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const htmlContent = await fetchHtmlContent(url);
        res.json(htmlContent);
    } catch (error) {
        console.error('Error fetching HTML:', error.message);
        res.status(500).send('Error fetching HTML: ' + error.message); // Return specific error message
    }
});

app.use("/", router);

app.listen(PORT, () => {
    console.log("Server Started...");
});
