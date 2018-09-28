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
  system: {
    rabbit: {
        url: process.env.SYSTEM_RABBIT_URI || process.env.RABBIT_URI || 'amqp://localhost:5672',
        exchange: process.env.SYSTEM_RABBIT_EXCHANGE || 'internal',
        serviceName: process.env.SYSTEM_RABBIT_SERVICE_NAME || 'auth_service' 
    },
    waitTime: process.env.SYSTEM_WAIT_TIME ? parseInt(process.env.SYSTEM_WAIT_TIME) : 10000    
    checkSystem: process.env.CHECK_SYSTEM ? parseInt(process.env.CHECK_SYSTEM) : true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES ? parseInt(process.env.JWT_EXPIRES) : 600,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ? parseInt(process.env.JWT_REFRESH_EXPIRES) : 6000
  }
};
