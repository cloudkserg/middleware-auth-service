/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const request = require('request-promise');

module.exports = async (token, userId, scopes) => {
  const tokenResponse = await request(`http://localhost:${config.http.port}/user/tokens`, {
    method: 'POST',
    json: {
      token,
      userId,
      scopes: scopes
    }
  });
  return tokenResponse.token;
};
