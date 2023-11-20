/*2023-11-20 First Commit    
�ѱ� ���� ���� �ذ� X
ũ�ѷ��� ����Ǿ����ϴ� �� �������
�� �ѱ۷� �� ǥ��ǳ� ũ�Ѹ��ؿ��� ��� ������ ������ ����
���� ũ�Ѹ��ϴ� ���̺귯���� ������� �Ǵ��Ͽ�
puppeteer ������� ���� (puppeteerCrawler.js)
*/

const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const url = 'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2=230&page=1';

console.log('ũ�ѷ��� ����Ǿ����ϴ�.');

axios.get(url)
    .then(response => {
        const html = iconv.decode(Buffer.from(response.data), 'utf-8');
        const $ = cheerio.load(html);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            

            // ��� ������ �������� �κ�
            const titles = [];
            $('.list_body.newsflash_body .photo a img').each((index, element) => {
                const title = $(element).attr('alt');
                titles.push(title);
            });

            console.log('��� ����:');
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
