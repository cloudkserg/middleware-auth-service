/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const  tokenLib = require('./lib/refreshToken'),
  errors = require('../errors'),
  blacklist = require('./blacklist');
/**
 * Object with main functions for auth.client
 */
module.exports = {
  /**
   * @param {String} clientId
   * @param {String[]} scopes
   */
  create: async (clientId, scopes) => {
    return tokenLib.create(clientId, scopes);
  },
  /**
   * @param {String} clientId
   * @param {String} token
   */
  check: async (token) => {
    const tokenData = tokenLib.check(token);
    if (await blacklist.has(token)) 
      throw new errors.BlacklistError('token in blacklist');
    return tokenData;
  },
};
