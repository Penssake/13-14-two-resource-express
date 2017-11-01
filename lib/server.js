'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');//const are stateless because they cannot change

mongoose.Promise = Promise;

const app = express();

let isOn = false;
let server = null;//we set them to false in null so if we call stop it will already off and wont try to stop if not running
//express doesnt have a way to turn off the server. Declaring server allowes us to call .close in stop

app.use(cors({ origin: process.env.ORIGIN_URL }));
app.use(morgan('dev'));

app.use(require('../route/character-router.js'));
app.all('*', (request, response) =>  response.sendStatus(404));
app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(isOn)
        return reject(new Error('__SERVER_ERROR__SERVER is already on'))
      server = app.listen(process.env.PORT, () => {
        isOn = true;
        console.log('__SERVER_ON__', process.env.PORT);
        resolve();
      })
    })
    .then(() => {
      return mongoose.createConnection(process.env.MONGOBD_URI, {useMongoClient: true});
    });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!isOn)
        return reject(new Error('__SERVER_ERROR__server is already off'))
      if(!server)
        return reject(new Error('__SERVER_ERROR__there is no server to close'))
        server.close(() => {
          isOn = false;
          server = null;
          console.log('__SERVER_OFF__');
          resolve();
        })
      })
    .then(() => mongoose.diconnect());
  },
};
