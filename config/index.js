/**
 * Chronobank/waves-rest configuration
 * @module config
 * @returns {Object} Configuration
 * 
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
*/
require('dotenv').config();
module.exports = {
  http: {
    port: parseInt(process.env.REST_PORT) || 8081,
  },
  mongo: {
    collectionPrefix: process.env.MONGO_COLLECTION_PREFIX || 'auth_service',
    data: { uri: process.env.MONGO_URI || 'mongodb://localhost:27017/data' }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES ? parseInt(process.env.JWT_EXPIRES) : 600,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ? parseInt(process.env.JWT_REFRESH_EXPIRES) : 6000
  }
};
