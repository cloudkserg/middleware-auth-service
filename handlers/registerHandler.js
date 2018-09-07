/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const requests = require('../requests'),
  bunyan = require('bunyan'),
  auth = require('../auth'),
  log = bunyan.createLogger({name: 'auth-service.registerHandler'});
/**
 * 
 * express handler of endpoint /services
 * with data = {id, secret}
 * register service with this credo in db
 * 
 * @param {Object} requestData
 * @param {String} requestData.body.id -- id of client
 * @param {String} requestData.body.secret -- secret of client
 * @returns {{ok: String}} 
 */
module.exports = async (requestData, response) => {
  try {
    
    const request = requests.registerRequest(requestData);
    await auth.client.create(request.id, request.secret);
    response.send({ok: true});

  } catch (e) {
    log.error('throw error:' + e.toString());
    response.status(400);
    response.send('Failure in register request');
  }

  return response;
};
