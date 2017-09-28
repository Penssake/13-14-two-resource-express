'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

mongoose.Promise = Promise;
// mongoose.connect(process.env.MONGOBD_URI, {useMongoClient: true});

const app = express();

let isOn = false;
let http = null;

app.use(cors({ origin: process.env.ORIGIN_URL }));
app.use(morgan('dev'));

app.use(require('../route/character-router.js'));
app.use(require('./error-middleware.js'));
app.use(require('../route/character-router.js'));

app.all('*', (request, response) =>  response.sendStatus(404));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(isOn)
        return reject(new Error('__SERVER_ERROR__SERVER is already on'))
      http = app.listen(PORT, () => {
        isOn = true;
        console.log('__SERVER_ON__', PORT);
        resolve();
      })
    })
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!isOn)
        return reject(new Error('__SERVER_ERROR__server is already off'))
      if(!http)
        return reject(new Error('__SERVER_ERROR__there is no server to close'))
        http.close(() => {
          isOn = false;
          http = null;
          console.log('__SERVER_OFF__');
          resolve();
        })
    })
    .then(() => mongoose.diconnect());
  },
};
