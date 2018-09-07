/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const clientTests = require('./client'),
  userTests = require('./user'),
  serviceTests = require('./services');

module.exports = (ctx) => {
  describe('client', () => clientTests(ctx));
  describe('user', () => userTests(ctx));
  describe('service', () => serviceTests(ctx));
};
