/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const mongoose = require('mongoose'),
  ttl = require('mongoose-ttl'),
  config = require('../config');

mongoose.set('useCreateIndex', true);
const Token = new mongoose.Schema({
  token: {type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});
Token.plugin(ttl, { ttl: config.jwt.refreshExpires });

module.exports = ()=> mongoose.model(`${config.mongo.collectionPrefix}Token`, Token);
