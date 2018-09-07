/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.refreshTokenHandler'});
/**
 * 
 * express handler of endpoint /tokens/refresh
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.token
 * @returns {{ok: String, token: String}} 
 */
module.exports = async (requestData, response) => {
  try {
    const request = requests.refreshTokenRequest(requestData);
    const tokenData = await auth.refreshToken.check(request.token);
    const token = await auth.client.createToken(tokenData.clientId, tokenData.scopes);
    response.send({ok: true, token});
  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in refresh token request');
  }
};
