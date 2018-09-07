/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
module.exports = {
  registerHandler: require('./registerHandler'),
  tokenHandler: require('./tokenHandler'),
  userTokenHandler: require('./userTokenHandler'),
  checkTokenHandler: require('./checkTokenHandler'),
  checkUserTokenHandler: require('./checkUserTokenHandler'),
  refreshTokenHandler: require('./refreshTokenHandler'),
  blackHandler: require('./blackHandler'),
};
