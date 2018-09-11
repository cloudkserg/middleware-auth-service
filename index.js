/** 
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/

const mongoose = require('mongoose'),
  config = require('./config'),
  models = require('./models'),
  express = require('express'),
  bunyan = require('bunyan'),
  handlers = require('./handlers'),
  log = bunyan.createLogger({name: 'auth-service'}),
  helmet = require('helmet');

mongoose.Promise = Promise;
mongoose.connect(config.mongo.data.uri, { useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
  
const init = async () => {

  [mongoose.connection].forEach(connection =>
    connection.on('disconnected', () => {
      throw new Error('mongo disconnected!');
    })
  );

  models.init();

  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.post('/services', handlers.registerHandler);

  app.post('/tokens', handlers.tokenHandler);
  app.post('/tokens/refresh', handlers.refreshTokenHandler);
  app.get('/tokens/check', handlers.checkTokenHandler);

  app.post('/user/tokens', handlers.userTokenHandler);
  app.get('/user/tokens/check', handlers.checkUserTokenHandler);

  app.post('/tokens/blacklist', handlers.blackHandler);

  app.listen(config.http.port);
  log.info(`Auth service started at port ${config.http.port}`);
};

module.exports = init();
