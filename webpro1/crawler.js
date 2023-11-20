/*2023-11-20 First Commit    
한글 깨짐 오류 해결 X
크롤러가 실행되었습니다 및 기사제목
은 한글로 잘 표기되나 크롤링해오는 기사 제목은 여전히 깨짐
따라서 크롤링하는 라이브러리의 문제라고 판단하여
puppeteer 사용으로 변경 (puppeteerCrawler.js)
*/

const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const url = 'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230&page=1';

console.log('크롤러가 실행되었습니다.');

axios.get(url)
    .then(response => {
        const html = iconv.decode(Buffer.from(response.data), 'utf-8');
        const $ = cheerio.load(html);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            

            // 기사 제목을 가져오는 부분
            const titles = [];
            $('.list_body.newsflash_body .photo a img').each((index, element) => {
                const title = $(element).attr('alt');
                titles.push(title);
            });

            console.log('기사 제목:');
            titles.forEach(title => {
                console.log('-', title);
            });
        } else {
            console.error('Failed to retrieve the page:', response.status);
        }
    })
    .catch(error => {
        console.error('Error fetching the page:', error);
    });
