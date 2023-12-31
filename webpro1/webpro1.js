/*2023-11-20 First Commit    
터미널에서
PS C:\WebPro1\PP_Webproject\webpro1> node webpro1.js
하면 Server is running at http://localhost:5500 하고 서버열림
불러오기 버튼 누르면 기사제목 크롤링됨
but url기능 없음(클릭시본문연결), 이미지없음

2023-11-21 
First Commit 불러오기 버튼 없앰, 이미지 추가
Second Commit 기사 제목 클릭시 본문으로 이동
3rd Commit 새로고침버튼추가 (업데이트된 기사 있으면 리로드)*/


const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 5500;
let cachedData = null;

app.use(express.static('public'));

app.get('/', async (req, res) => {
    if (!cachedData) {
        await fetchData();
    }
    res.send(renderHTML(cachedData));
});

app.get('/refresh', async (req, res) => {
    await fetchData();
    res.send({ success: true, data: cachedData });
});

async function fetchData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230');

    cachedData = await page.evaluate(() => {
        const data = [];
        const titleElements = document.querySelectorAll('.list_body.newsflash_body .photo a img');

        titleElements.forEach((img) => {
            const title = img.alt;
            const imageUrl = img.src;
            const articleUrl = img.parentElement.href;  // Added to get article URL
            data.push({ title, imageUrl, articleUrl });
        });

        return data;
    });

    await browser.close();
}

function renderHTML(titlesAndImages) {
    const items = titlesAndImages.map(item => `<li><a href="${item.articleUrl}" target="_blank"><img src="${item.imageUrl}" alt="${item.title}"><br>${item.title}</a></li>`).join('');

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
            <button id="refreshButton">새로고침</button>
            <ul id="newsList">${items}</ul>

            <script>
                async function fetchDataAndRender() {
                    const response = await fetch('http://localhost:5500/refresh');
                    if (response.ok) {
                        const data = await response.json();
                        const items = data.data.map(item => \`<li><a href="\${item.articleUrl}" target="_blank"><img src="\${item.imageUrl}" alt="\${item.title}"><br>\${item.title}</a></li>\`).join('');
                        document.getElementById('newsList').innerHTML = items;
                    }
                }

                document.getElementById('refreshButton').addEventListener('click', fetchDataAndRender);

                // Initial data fetching on page load
                fetchDataAndRender();
            </script>
        </body>
        </html>
    `;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


