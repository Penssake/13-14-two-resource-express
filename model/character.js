'use strict';

const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  job: {type: String, required: true, unique: true},
  location: {type: String},
  children: [{type: mongoose.Schema.Types.ObjectID, ref: 'child'}],
});
//characterSchema.push('save',) //save a character/make sure it exhist first//404 is it doesn't
module.exports = mongoose.model('character', characterSchema);
