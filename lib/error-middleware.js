'use strict';

module.exports = (error, request, response, next) => {
  console.error(error);

  if(error.status)
    return response.sendStatus(error.status);

  let message = error.message.toLowerCase();

  if(message.includes('objectid failed'))
    return response.sendStatus(404);

  if(message.includes('validation failed'))
    return response.sendStatus(400);

  if(message.includes('duplicate key'))
    return response.sendStatus(409);


  response.sendStatus(500);

};
