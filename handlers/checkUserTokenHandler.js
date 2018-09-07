/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.checkUserTokenHandler'});
/**
 * 
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.token -- token of user
 * @param {String} requestData.body.userId - id of user
 * @param {String} requestData.body.scope - scope of proxy service
 * @returns Response {{ok: String}} 
 */
module.exports = async (requestData, response) => {
  try {
    const request = requests.checkUserTokenRequest(requestData);
    await auth.client.checkUserToken(request.userId, request.scope, request.token);
    response.send({ok: true});
  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in check user token request');
  }
};
