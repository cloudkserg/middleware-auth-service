/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.tokenHandler'});
/**
 * 
 * express handler of endpoint POST /tokens
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.id
 * @param {String[]} requestData.body.scopes
 * @returns {{ok: String, token: String, refreshToken: String}} response 
 */
module.exports = async (requestData, response) => {
  try {
    const request = requests.tokenRequest(requestData);
    await auth.client.check(request.id, request.secret);
    const token = await auth.client.createToken(request.id, request.scopes);
    const refreshToken = await auth.refreshToken.create(request.id, request.scopes);
    response.send({ok: true, token, refreshToken});
  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in token request');
  }

  return response;
};
