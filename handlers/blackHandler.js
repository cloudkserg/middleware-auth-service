/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.blackHandler'});
/**
 * 
 * express handler of endpoint /tokens/refresh
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.token -- token of client, that request operation
 * @param {String} requestData.body.blackToken -- token, that add to blacklist
 * @returns {{ok: String}} 
 */
module.exports = async (requestData, response) => {
  try {
    const request = requests.blackRequest(requestData);
    await auth.client.validToken(request.token);

    await auth.blacklist.add(request.blackToken);
    response.send({ok: true});
  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in black token request');
  }
};
