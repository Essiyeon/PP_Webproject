const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

let cachedData = null;
//app.use(express.static('public'));
app.use(express.static(__dirname +'/public', { ignore: ['/favicon.ico'] }));
app.use('/public', express.static(path.join(__dirname, 'public'), { 'Content-Type': 'text/css' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    if (!cachedData) {
        await fetchData();
    }
    res.render('index', { crawledData: cachedData });
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
            const articleUrl = img.parentElement.href;
            data.push({ title, imageUrl, articleUrl });
        });

        return data;
    });

    await browser.close();
}

app.post('/search', (req, res) => {
    console.log(req.body);
    const query = req.body.query;

    if (query) {
        searchNaverNews(query, (searchResults) => {
            res.render('searchResults', { searchResults });
        });
    } else {
        res.render('searchResults', { searchResults: [] });
    }
});

function searchNaverNews(query, callback) {
    const client_id = 'Qjsbi3MIetlWRmDaz6vS';
    const client_secret = 'LVlyDdZNMy';
    const api_url = `https://openapi.naver.com/v1/search/news?display=30&query=${encodeURI(query)}`;

    const options = {
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    axios.get(api_url, options)
        .then(response => {
            const newsItems = response.data.items;
            callback(newsItems);
        })
        .catch(error => {
            console.error('Naver Search API 요청 중 오류:', error);
            callback([]);
        });
}

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
