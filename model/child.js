'use strict';

const mongoose = require('mongoose');

const childSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  character: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'character'},
});

module.exports = mongoose.model('child', childSchema);
