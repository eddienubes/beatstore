const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const {promisify} = require('util');
const crypto = require('crypto');
require('dotenv').config();
const privateKey = fs.readFileSync('../sslcert/privkey.pem', 'utf-8');
const certificate = fs.readFileSync('../sslcert/fullchain.pem', 'utf-8');
const credentials = {key: privateKey, cert: certificate};

const beatsRoutes = require('./routes/beats-routes');
const usersRoutes = require('./routes/users-routes');
const ordersRoutes = require('./routes/order-routes');
const licensesRoutes = require('./routes/licenses-routes');
const botRoutes = require('./routes/bot-routes');

const HttpError = require('./models/http-error');

const app = express();

const server = https.createServer(credentials, app);


// default and supported routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Range, Accept-Ranges, Accept-Encoding, Content-Disposition',);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    next();
});

app.use('/api/data/beats', express.static(path.join(__dirname, 'data', 'beats')));
app.use('/api/data/covers', express.static(path.join(__dirname, 'data', 'covers')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/beats', beatsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/licenses', licensesRoutes);
app.use('/api/bots', botRoutes);


// audio stream handling
// app.get('/api/data/beats/:bid', async (req, res, next) => {
//     // getting filePath
//     const bid = req.params.bid;
//     const filePath = path.resolve(__dirname, './data', './beats', bid);
//     console.log(filePath);
//     // converting callback into promise
//     const fileInfo = promisify(fs.stat);
//
//     // calculating size of file
//     const {size} = await fileInfo(filePath);
//
//     // cashing requested byte range
//     const range = req.headers.range;
//
//     if (range) {
//         let [start, end] = range.replace(/bytes=/, '').split('-');
//
//         start = parseInt(start, 10);
//         end = end ? parseInt(end, 10) : size - 1;
//
//         if (!isNaN(start) && isNaN(end)) {
//             end = size - 1;
//         }
//         if (isNaN(start) && !isNaN(end)) {
//             start = size - end;
//             end = size - 1;
//         }
//
//         // case when requested range is unavailable
//         if (start >= size || end >= size) {
//             res.writeHead(416, {
//                 'Content-Range': `bytes */${size}`
//             });
//             return res.end();
//         }
//
//         res.writeHead(206, {
//             'Content-Range': `bytes ${start}-${end}/${size}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': end - start + 1,
//             'Content-Type': 'audio/mp3'
//         });
//
//         let readable = fs.createReadStream(filePath, {start: start, end: end});
//         stream.pipeline(readable, res, err => {
//             console.log(err);
//         });
//     } else {
//
//         res.writeHead(200, {
//             'Content-Length': size,
//             'Content-Type': 'audio/mp3'
//         });
//
//         let readable = fs.createReadStream(filePath);
//         stream.pipeline(readable, res, err => {
//             console.log(err)
//         })
//     }
// });

// router in case none of above haven't been reached

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// app.use((req, res) => {
//     throw new HttpError('Couldn\'t find this route...');
// });

// error handler
app.use((error, req, res, next) => {
    if (req.files) {
        Object
            .values(req.files)
            .forEach(arr => arr.map(f => fs.unlink(f.path, err => {
                console.log(err);
            })));
    }

    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || error.status);
    res.json({message: error.message || 'An unknown error occurred!'});
});

const app2 = express();
const server2 = http.createServer(app2);

app2.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
});


// port configuration and connection to database
mongoose
    .connect(process.env.mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        server.listen(process.env.port);
        server2.listen(process.env.redirectPort);
        console.log('Server is up and running on port ' + process.env.port);
        console.log('Redirect server is up and running on port ' + process.env.redirectPort);
    })
    .catch(async (err) => {
        console.log(err.message);
        process.on('exit', () => {
            server.close();
            server2.close();
        });
        process.on('SIGINT', () => {
            server.close();
            server2.close();
        });
    });


