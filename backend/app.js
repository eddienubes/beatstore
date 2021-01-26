const express = require('express');
const bodyParser = require('body-parser');

const beatsRoutes = require('./routes/beats-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

// default and supported routes
app.use(bodyParser.json());
app.use('/api/beats', beatsRoutes);
app.use('/api/users', usersRoutes);

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

// port configuration
app.listen(5000);
