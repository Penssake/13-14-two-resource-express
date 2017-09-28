'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Character = require('../model/character.js');

const characterRouter = module.exports = new Router();

characterRouter.post('/character', jsonParser, (request, response, next) => {
  if(!request.body.name)
    return next(httpErrors(400, 'Character model requires a name'));

  new Character(request.body).save()
    .then(character => response.json(character))
    .catch(next);
});
