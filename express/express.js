#!/usr/bin/env node

const debug = require('debug')('smart-home-api:server');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');   // Bu paket gelen isteklerin konsoldan çıktı olarak verilmesini sağlamaktadır.

const indexRouter = require('./routesControl');
const notFoundRouter = require('../routes/notFound');
const configs = require('../config.json');
const { port } = configs.express;
const { maxFileSizeMB } = configs.uploadConfig;

const app = express();
app.use(cors());
app.set('port', port);

app.use(logger('dev'));
app.use(express.json({ limit: `${maxFileSizeMB}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${maxFileSizeMB}mb` }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('*', notFoundRouter);

//catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// HTTP modülünü kaldırıyoruz, doğrudan Express'in listen fonksiyonunu kullanıyoruz
app.listen(process.env.PORT || port, () => {
    debug(`Listening on port ${port}`);
});
