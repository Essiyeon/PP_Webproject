/*2023-11-20 First Commit    
터미널에서
PS C:\WebPro1\PP_Webproject\webpro1> node webpro1.js
하면 Server is running at http://localhost:5500 하고 서버열림

불러오기 버튼 누르면 기사제목 크롤링됨
but url기능 없음(클릭시본문연결), 이미지없음*/

const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 5500;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('webpro1.html', { root: __dirname });
});

app.get('/fetchData', async (req, res) => {
    const titles = await fetchData();
    res.json({ titles });
});

async function fetchData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230&page=1');

    const titles = await page.evaluate(() => {
        const titleElements = document.querySelectorAll('.list_body.newsflash_body .photo a img');
        return Array.from(titleElements, img => img.alt);
    });

    await browser.close();

    return titles;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
