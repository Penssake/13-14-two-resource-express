'use strict';

process.env.PORT = 7000;
// process.env.CORS_ORIGIN;
process.env.MONGOBD_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const Character = require('../model/Character.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let createCharacter = () => {
  return new Character({
    name: faker.lorem.words(3),
    job: faker.lorem.words(1),
    location: faker.lorem.words(1),
    children: faker.random.number(),
  }).save();
};

let createCharacterMany = (num) => {
  console.log(createCharacterMany, num);
  return Promise.all(new Array (8).fill(0).map(() => createCharacter()));
};

describe('/api/characters', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Character.remove({}));

  describe('POST /characters', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/characters`)
        .send({
          name: 'Paul Mitchell',
          job: 'Profesional Skater',
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual('Paul Mitchell');
          expect(response.body.job).toEqual('Profesional Skater');
        });
    });

    describe('409 due to duplicate', () => {
      return createCharacter()
        .then(character => {
          return superagent.post(`${apiURL}/characters`)
            .send({
              name: character.name,
              job: character.job,
            });
        });
    });

    describe('409 due to duplicate', () => {
      return createCharacter()
        .then(character => {
          return superagent.post(`${apiURL}/characters`)
            .send({
              name: character.name,
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });

    describe('400 due to no name', () => {
      return superagent.post(`${apiURL}/characters`)
        .send({})
        .then(Promise.reject)
        .then(response => {
          expect(response.status).toEqual(400);
        });
    });
  });
});//objects work as queries in mongo
