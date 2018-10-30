/** 
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/

const mongoose = require('mongoose'),
  config = require('./config'),
  models = require('./models'),
  express = require('express'),
  AmqpService = require('middleware_common_infrastructure/AmqpService'),
  InfrastructureInfo = require('middleware_common_infrastructure/InfrastructureInfo'),
  InfrastructureService = require('middleware_common_infrastructure/InfrastructureService'),
  bunyan = require('bunyan'),
  handlers = require('./handlers'),
  socialRoutes = require('./routes/socialRoutes'),
  log = bunyan.createLogger({name: 'auth-service'}),
  helmet = require('helmet');

mongoose.Promise = Promise;
mongoose.connect(config.mongo.data.uri, { useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

const runSystem = async function () {
  const rabbit = new AmqpService(
    config.system.rabbit.url, 
    config.system.rabbit.exchange,
    config.system.rabbit.serviceName
  );
  const info = new InfrastructureInfo(require('./package.json'), config.system.waitTime);
  const system = new InfrastructureService(info, rabbit, {checkInterval: 10000});
  await system.start();
  system.on(system.REQUIREMENT_ERROR, (requirement, version) => {
    log.error(`Not found requirement with name ${requirement.name} version=${requirement.version}.` +
        ` Last version of this middleware=${version}`);
    process.exit(1);
  });
  await system.checkRequirements();
  system.periodicallyCheck();
};
  
const init = async () => {
  if (config.system.checkSystem)
    await runSystem();

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

  socialRoutes(app); 

  app.listen(config.http.port);
  log.info(`Auth service started at port ${config.http.port}`);
};

module.exports = init();
