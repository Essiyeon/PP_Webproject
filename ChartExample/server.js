// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/chartData', (req, res) => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [10, 20, 15, 25, 30],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
            },
            {
                label: 'Dataset 2',
                data: [5, 15, 10, 20, 25],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
            }
        ]
    };
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
