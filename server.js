// api/download.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add these args for Vercel
    });

    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
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

        res.status(200).json(downloadLinks);
    } catch (error) {
        console.error('Error fetching HTML:', error);
        res.status(500).json({ message: 'Error fetching HTML: ' + error.message });
    } finally {
        await browser.close();
    }
}
