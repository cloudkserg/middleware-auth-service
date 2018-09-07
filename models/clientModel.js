/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const mongoose = require('mongoose'),
  config = require('../config');

mongoose.set('useCreateIndex', true);
const Client = new mongoose.Schema({
  clientId: {type: String, required: true, index: true, unique: true },
  secret: {type: String, required: true},
  createdAt: { type: Date, default: Date.now }
});

module.exports = ()=> mongoose.model(`${config.mongo.collectionPrefix}Client`, Client);
