const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client_id = 'Qjsbi3MIetlWRmDaz6vS';
const client_secret = 'LVlyDdZNMy';
const api_url = 'https://openapi.naver.com/v1/datalab/search';

const currentDate = new Date().toISOString().split('T')[0];

const request_body = {
    "startDate": "2023-01-01",
    "endDate": currentDate,
    "timeUnit": "month",
    "keywordGroups": [
        {
            "groupName": "아이폰",
            "keywords": [
                "애플",
                "아이폰",
                "iphone"
            ]
        },
        {
            "groupName": "갤럭시",
            "keywords": [
                "삼성",
                "갤럭시",
                "Galaxy"
            ]
        }
    ],
};


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chartData', function (req, res) {
    request.post({
        url: api_url,
        body: JSON.stringify(request_body),
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret,
            'Content-Type': 'application/json',
        },
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body).results;
            res.json(data);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
});

app.listen(port, function () {
    console.log('Server is running on port ' + port);
    console.log(`http://localhost:${port}`);
});
