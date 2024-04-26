const express = require('express');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
    const htmlContent = req.body.html_content;
    if (!htmlContent) {
        return res.status(400).send('O campo html_content não pode ser nulo');
    }

    const folderStoragePath = 'storage/';
    const folderStaticPath = 'public/';
    const outputPathFileName = uuidv4() + '.pdf';
    const outputPath = path.join(folderStoragePath, outputPathFileName);

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], executablePath: '/usr/bin/google-chrome-stable' });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: outputPath, format: 'A4' });
        await browser.close();

        const response = {
            file: path.join(folderStaticPath, outputPathFileName),
            filename: outputPathFileName,
            message: 'pdf generated successfully',
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Server running on port ${port}`));