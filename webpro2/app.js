const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 5500;

app.use(express.static('public'));

app.get('/', async (req, res) => {
    const titlesAndImages = await fetchData();
    res.send(renderHTML(titlesAndImages));
});

async function fetchData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230&page=1');

    const titlesAndImages = await page.evaluate(() => {
        const data = [];
        const titleElements = document.querySelectorAll('.list_body.newsflash_body .photo a img');

        titleElements.forEach((img) => {
            const title = img.alt;
            const imageUrl = img.src;
            data.push({ title, imageUrl });
        });

        return data;
    });

    await browser.close();

    return titlesAndImages;
}

function renderHTML(titlesAndImages) {
    const items = titlesAndImages.map(item => `<li><img src="${item.imageUrl}" alt="${item.title}"><br>${item.title}</li>`).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Naver News Crawling</title>
        </head>
        <body>
            <h1>Naver News Crawling</h1>
            <ul>${items}</ul>
        </body>
        </html>
    `;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
