'use strict';

process.env.PORT = 7000;
process.env.CORS_ORIGIN;
process.env.MONGOBD_URI = 'mongodb://localhost/testing';
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const Child = require('../model/child.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let createChild = () => {
  return new Child({
    name: faker.lorem.words(2),
  }).save();
};

describe('POST /child', () => {
  test('200', () => {
    return superagent.post(`${apiURL}/child`)
      .send({
        name: 'John Jacob',
      })
      .then(response => {
        console.log(response);
        expect();
        expect();
        expect();
      });
  });

  describe('409 due to duplicate', () => {
    return createChild()
      .then(child => {
        return superagent.post(`${apiURL}/child`)
          .send({
            name: child.name,
          });
      });
  });
});
