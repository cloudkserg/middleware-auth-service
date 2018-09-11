/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const request = require('request-promise');

module.exports = async (token, blackToken) => {
  const tokenResponse = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
    method: 'POST',
    json: {
      token,
      blackToken
    }
  });
  return tokenResponse.ok;
};
