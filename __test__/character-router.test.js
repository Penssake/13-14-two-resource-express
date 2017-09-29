'use strict';

process.env.PORT = 7000;
process.env.CORS_ORIGIN;//assist with browser allowances
process.env.MONGOBD_URI = 'mongodb://localhost/testing';//mongo test db

const faker = require('faker');//faker creates massive amout of fake data. We declare a variable called const with the const keyword. Constants cannot be reassigned.
const superagent = require('superagent');

const server = require('../lib/server.js');//required the files that character-router.jest.js are dependent on

const Character = require('../model/character.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let createCharacter = () => { // the createCharacter function creates and saves a character to the db
  return new Character({
    name: faker.lorem.words(3),//faker creates fake data
    job: faker.lorem.words(1),
    location: faker.lorem.words(1),
    children: faker.random.number(),
    //add timestamp
  }).save(); //save() saves it to database
};

let createCharacterMany = (num) => {
  console.log(createCharacterMany, num);
  return Promise.all(new Array (num).fill(0).map(() => createCharacter()));
};

describe('/characters', () => {
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
          console.log(response);
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
  });
});
