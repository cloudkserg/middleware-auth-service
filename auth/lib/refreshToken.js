/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
var jwt = require('jsonwebtoken'),
  uniqid = require('uniqid'),
  config = require('../../config'),
  errors = require('../../errors');
const TYPE = 'refresh';
module.exports = {
  /**
   * @param {String} clientId
   * @param {String[]} scopes
   */
  create: (clientId, scopes) => {
    return jwt.sign({ clientId, scopes, type: TYPE, data: uniqid()}, config.jwt.secret, 
      { expiresIn: config.jwt.refreshExpires }
    );
  },
  /**
   * @param {String} token
   * @returns {{clientId: String, scopes: String[], type: String}}
   */
  check: (token) => {
    const tokenData = jwt.verify(token, config.jwt.secret);
    /**
     * @param {{clientId: String, scopes: String[], type: String}} tokenData
     */
    if (!(tokenData.type && tokenData.type === TYPE))
      throw new errors.WrongTokenError('not refresh token');
    return tokenData;
  }
};
