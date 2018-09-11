/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const password = require('../utils/password'),
  models = require('../models'),
  userToken = require('./lib/userToken'),
  tokenLib = require('./lib/token'),
  errors = require('../errors'),
  blacklist = require('./blacklist');

/**
 * Object with main functions for auth.client
 */
module.exports = {
  /**
   * @param {String} clientId
   * @param {String} secret
   */
  create: async (clientId, secret) => {
    return await models.clientModel.create({clientId,
      secret: await password.hash(secret)
    }).catch(_ => {});
  },
  /**
   * @param {String} clientId
   * @param {String} secret
   */
  check: async (clientId, secret) => {
    const client = await models.clientModel.findOne({clientId});
    if (!client) 
      throw new errors.ValidateError('not found client');
    return await password.check(secret, client.secret);
  },


  /**
   * @param {String} clientId
   * @param {Array} scopes
   */
  createToken: async (clientId, scopes) => {
    return tokenLib.create(clientId, scopes);
  },

  /**
   * @param {String} token
   * @returns {{clientId: String, scopes: String[]}}
   */
  validToken: async (token) => {
    const tokenData = tokenLib.valid(token);
    if (await blacklist.has(token)) 
      throw new errors.BlacklistError('client token in blacklist');
    return tokenData;
  },

  /**
   * @param {String} clientId
   * @param {String} scope
   * @param {String} token
   */
  checkToken: async (clientId, scope, token) => {
    tokenLib.check(clientId, scope, token);
    if (await blacklist.has(token)) 
      throw new errors.BlacklistError('client token in blacklist');
    return true;
  },



  /**
   * @param {String} clientId
   * @param {Array} scopes
   * @param {String} userId
   */
  createUserToken: async (clientId, scopes, userId) => {
    return userToken.create(clientId, scopes, userId);
  },

  /**
   * @param {String} userId
   * @param {String} scope
   * @param {String} token
   */
  checkUserToken: async (userId, scope, token) => {
    userToken.check(userId, scope, token);
    if (await blacklist.has(token)) 
      throw new errors.BlacklistError('user token in blacklist');
    return true;
  }
};
