const express = require('express');
const pdf = require('html-pdf');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
    const htmlContent = req.body.html_content;
    if (!htmlContent) {
        return res.status(400).send('O campo html_content não pode ser nulo');
    }

    const folderStoragePath = 'storage/';
    const folderStaticPath = 'public/';
    const outputPathFileName = uuidv4() + '.pdf';
    const outputPath = path.join(folderStoragePath, outputPathFileName);

    const options = { format: 'A4' };

    pdf.create(htmlContent, options).toFile(outputPath, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }

        const response = {
            file: path.join(folderStaticPath, outputPathFileName),
            filename: outputPathFileName,
            message: 'pdf generated successfully',
        };

        res.status(200).json(response);
    });
});

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Server running on port ${port}`));