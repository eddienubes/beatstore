const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const beatsRoutes = require('./routes/beats-routes');
const usersRoutes = require('./routes/users-routes');
const ordersRoutes = require('./routes/order-routes');
const licensesRoutes = require('./routes/licenses-routes');
const botRoutes = require('./routes/bot-routes');

const app = express();

const server = http.createServer(app);

// default and supported routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Range, Accept-Ranges, Accept-Encoding, Content-Disposition'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
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
    Object.values(req.files).forEach((arr) =>
      arr.map((f) =>
        fs.unlink(f.path, (err) => {
          console.log(err);
        })
      )
    );
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || error.status);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// port configuration and connection to database
mongoose
  .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    server.listen(process.env.PORT);
    console.log('Connected to MongoDB successfully!');
    console.log(`Server is up and running on port ${process.env.PORT}`);
  })
  .catch(async (err) => {
    console.log(err.message);
    process.on('exit', () => {
      server.close();
    });
    process.on('SIGINT', () => {
      server.close();
    });
  });
