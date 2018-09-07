/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.checkTokenHandler'});
/**
 * 
 * express handler of endpoint /tokens/check
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.id
 * @param {String} requestData.body.scope
 * @param {String} requestData.body.token
 * @returns {{ok: String}} 
 */
module.exports = async (requestData, response) => {
  try {
    const request = requests.checkTokenRequest(requestData);
    await auth.client.checkToken(request.id, request.scope, request.token);
    response.send({ok: true});
  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in check token request');
  }
};
