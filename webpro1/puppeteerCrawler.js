/*2023-11-20 First Commit    
Puppeteer old Headless deprecation warning �� �߻��ϳ�
��������� �������� ũ�Ѹ��� (�ܼ�â���)
*/
const puppeteer = require('puppeteer');

console.log('���̹� ������ ũ�Ѹ��մϴ�.');

const url = 'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230&page=1';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const titles = await page.evaluate(() => {
        const titleElements = document.querySelectorAll('.list_body.newsflash_body .photo a img');
        return Array.from(titleElements, img => img.alt);
    });

    console.log('��� ����:');
    titles.forEach(title => {
        console.log('-', title);
    });

    await browser.close();
})();
