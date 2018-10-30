/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
var jwt = require('jsonwebtoken'),
  uniqid = require('uniqid'),
  config = require('../../config'),
  errors = require('../../errors');
const TYPE = 'user';
module.exports = {

  /**
   * @param {String} clientId
   * @param {String[]} scopes
   * @param {String} userId
   */
  create: (clientId, scopes, userId, data) => {
    if (!data)
      data = {};
    data['uniqid'] = uniqid();
    return jwt.sign({ clientId, scopes, userId, type: TYPE, data}, config.jwt.secret, 
      { expiresIn: config.jwt.expires }
    );
  },
  /**
   * @param {String} userId
   * @param {String} scope
   * @param {String} token
   * @returns {{clientId: String, scopes: String[], userId: String, type: String}}
   */
  check: (userId, scope, token) => {
    const tokenData = jwt.verify(token, config.jwt.secret);
    /**
     * @param {{clientId: String, scopes: String[], userId: String, type: String}} tokenData
     */
    if (!(tokenData.scopes && tokenData.scopes.includes && tokenData.scopes.includes(scope)))
      throw new errors.WrongTokenError('scope not right in token');
    if (!(tokenData.userId && tokenData.userId === userId))
      throw new errors.WrongTokenError('userId not right in token');
    if (!(tokenData.type && tokenData.type === TYPE))
      throw new errors.WrongTokenError('not user token');
    return tokenData;
  }
};
