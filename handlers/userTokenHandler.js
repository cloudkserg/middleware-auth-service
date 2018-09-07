/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.userTokenHandler'});
/**
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.token -- token of client(exists check on it)
 * @param {String} requestData.body.userId - id of user
 * @param {String[]} requestData.body.scopes --scopes of token user
 * @returns {{ok: String, token: String}}  
 */
module.exports = async (requestData, response) => {
  try {
    const request = requests.userTokenRequest(requestData);
    const tokenData = await auth.client.validToken(request.token);
    const token = await auth.client.createUserToken(tokenData.clientId, 
      request.scopes, request.userId);
    response.send({ok: true, token});
  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in create user token request');
  }
};
