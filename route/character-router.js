'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Character = require('../model/character.js');

const characterRouter = module.exports = new Router();

characterRouter.post('/character', jsonParser, (request, response, next)  => {
  if(!request.body.name)
    return next(httpErrors(400, 'Character model requires a name'));

  new Character(request.body).save()
    .then(character => response.json(character))
    .catch(next);
});

characterRouter.put('/character/:id', jsonParser, (request, response, next)  => {
  let options = {new: true, runValidators: true};
  Character.findByIdAndUpdate(request.params.id, request.body, options)
    .then(character => {
      if(!character)
        throw httpErrors(404, 'character not found');
      response.json(character);
    })
    .catch(next);
});

characterRouter.get('/character/:id', (request, response, next)  => {
  Character.findById(request.params.id)
    .then(character => {
      if(!character)
        throw httpErrors(404, 'character not found');
      response.json(character);
    })
    .catch(next);
});

characterRouter.delete('/character:/id', (request, response, next)  => {
  Character.findByIdAndRemove(request.params.id)
    .then(character => {
      if(!character)
        throw httpErrors(404, 'character not found');
      response.snedStatus(404);
    })
    .then(next);
});
