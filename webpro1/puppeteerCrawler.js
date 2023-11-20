/*2023-11-20 First Commit    
Puppeteer old Headless deprecation warning 이 발생하나
기사제목은 문제없이 크롤링됨 (콘솔창출력)
*/
const puppeteer = require('puppeteer');

console.log('네이버 뉴스를 크롤링합니다.');

const url = 'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230&page=1';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const titles = await page.evaluate(() => {
        const titleElements = document.querySelectorAll('.list_body.newsflash_body .photo a img');
        return Array.from(titleElements, img => img.alt);
    });

    console.log('기사 제목:');
    titles.forEach(title => {
        console.log('-', title);
    });

    await browser.close();
})();
