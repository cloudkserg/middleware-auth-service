/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
var jwt = require('jsonwebtoken'),
  uniqid = require('uniqid'),
  config = require('../../config'),
  errors = require('../../errors');
const TYPE = 'client';
module.exports = {
  /**
   * @param {String} clientId
   * @param {string[]} scopes
   */
  create: (clientId, scopes) => {
    return jwt.sign({ clientId, scopes, type: TYPE, data: uniqid()}, config.jwt.secret, 
      { expiresIn: config.jwt.expires }
    );
  },
  /**
   * @param {String} token
   * @returns {{clientId: String, scopes: String[], type: String}}
   */
  valid: (token) => {
    const tokenData =  jwt.verify(token, config.jwt.secret);
    if (!(tokenData.type && tokenData.type === TYPE))
      throw new errors.WrongTokenError('not client token');
    return tokenData;
  },
  /**
   * @param {String} clientId
   * @param {String} scope
   * @param {string} token
   * @returns {{clientId: String, scopes: String[], type: String}}
   */
  check: (clientId, scope, token) => {
    const tokenData = jwt.verify(token, config.jwt.secret);
    /**
     * @param {{clientId: String, scopes: String[]}} tokenData
     */
    if (!(tokenData.scopes && tokenData.scopes.includes && tokenData.scopes.includes(scope)))
      throw new errors.WrongTokenError('scope not right in token');
    if (!(tokenData.clientId && tokenData.clientId === clientId))
      throw new errors.WrongTokenError('clientId not right in token');
    if (!(tokenData.type && tokenData.type === TYPE))
      throw new errors.WrongTokenError('not client token');
    return tokenData;
  }
};
