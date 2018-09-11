/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const request = require('request-promise');

module.exports = async (client, scopes, withRefreshToken = false) => {
  const tokenResponse = await request(`http://localhost:${config.http.port}/tokens`, {
    method: 'POST',
    json: {
      id: client.clientId,
      secret: client.secret,
      scopes: scopes
    }
  });
  if (withRefreshToken)
    return tokenResponse;
  return tokenResponse.token;
};
