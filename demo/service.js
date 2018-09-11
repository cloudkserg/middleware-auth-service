/** 
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/

const express = require('express'),
  profileMiddleware = require('./profileMiddleware'),
  config = require('./config'),
  authMiddleware = require('./authMiddleware');

const init = async () => {

  const app = express();
  app.use(express.json());

  //app.use(authMiddleware(config.auth, profileMiddleware));
  app.use(authMiddleware(config.auth));


  app.post('/do', function (request, response) {
    const msg = (response.locals.data.userId) ? 'userId:' + response.locals.data.userId :
      'clientId:' + response.locals.data.clientId; 

    response.send({ok: true, msg});
  });

  app.listen('8083');
  console.log('8083 service started at port 8083');
};

module.exports = init();
