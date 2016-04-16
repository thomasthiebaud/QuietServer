'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const phoneRoutes = require('./app/phone/phone.route');
const userRoutes = require('./app/user/user.route');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/api', phoneRoutes);
app.use('/api', userRoutes);
app.listen(port);

module.exports = app;
