const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Range, Accept-Ranges, Accept-Encoding, Content-Disposition'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});

app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, 'public')));
// router in case none of above haven't been reached
app.use((req, res, next) => {
    res.send('GET OUT OF HERE!!!');
});

const server = http.createServer(app);

server.listen(80, () => console.log('Certbot verification server has started'));