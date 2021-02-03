const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const beatsRoutes = require('./routes/beats-routes');
const usersRoutes = require('./routes/users-routes');
const ordersRoutes = require('./routes/order-routes');
const licensesRoutes = require('./routes/licenses-routes');

const HttpError = require('./models/http-error');

const app = express();

const url = 'mongodb+srv://eddienubes:xfB6vAVfFlmdfmTR@cluster0.5u9ib.mongodb.net/beatstore?retryWrites=true&w=majority';

// default and supported routes
app.use(bodyParser.json());
app.use('/api/beats', beatsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/licenses', licensesRoutes);

// router in case none of above haven't been reached
app.use((req, res) => {
    throw new HttpError('Couldn\'t find this route...');
});

// error handler
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

// port configuration and connection to database
mongoose
    .connect(url)
    .then(() => app.listen(5000))
    .catch((err) => console.log(err));
