/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const request = require('request-promise'),
  config = require('../config');

module.exports = async (clientId, token, scope) => {
  const tokenResponse = await request(`http://localhost:${config.http.port}/tokens/check`, {
    method: 'GET',
    json: {
      token,
      scope,
      id: clientId
    }
  }).catch(e => { return e; });
  if (tokenResponse.statusCode === 400)
    return tokenResponse;
  return tokenResponse.ok;
};
