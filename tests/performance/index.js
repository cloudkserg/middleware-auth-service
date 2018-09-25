/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */


const config = require('../config'),
  models = require('../../models'),
  _ = require('lodash'),
  memwatch = require('memwatch-next'),
  uniqid = require('uniqid'),
  expect = require('chai').expect,
  request = require('request-promise'),
  generateToken = require('../utils/generateToken'),
  checkToken = require('../utils/checkToken'),
  generateUserToken = require('../utils/generateUserToken'),
  addToBlacklist = require('../utils/addToBlacklist'),
  checkUserToken = require('../utils/checkUserToken'),
  password = require('../../utils/password'),
  Promise = require('bluebird');


module.exports = (ctx) => {

  before (async () => {
    await models.tokenModel.deleteMany({});
    await models.clientModel.deleteMany({});

    ctx.client = await models.clientModel.create({
      clientId: 11, 
      secret: await password.hash('secret')
   });
   ctx.client.secret = 'secret';
  });

  after (async () => {
    delete ctx.client;
  });

  it('validate memory for send 100 requests for token create and check, check unright', async () => {
    let hd = new memwatch.HeapDiff();

    await Promise.map(_.range(0, 100), async () => {
      const client = await models.clientModel.create({
        clientId: uniqid(), 
        secret: await password.hash('secret')
      });
      client.secret = 'secret';
      const token = await generateToken(client, ['abba']);
      await checkToken(client.clientId, token, 'abba');
      await checkToken(client.clientId, token, 'abba2');
      await addToBlacklist(token, token);
      await checkUserToken(client.clientId, token, 'abba');
    });
    let diff = hd.end();
    let leakObjects = _.filter(diff.change.details, detail => detail.size_bytes / 1024 / 1024 > 3);

    expect(leakObjects.length).to.be.eq(0);
  });

  it('validate memory for send 100 requests for token create, user token create and check, check unright', async () => {
    let hd = new memwatch.HeapDiff();

    await Promise.map(_.range(0, 100), async () => {
      const client = await models.clientModel.create({
        clientId: uniqid(), 
        secret: await password.hash('secret')
      });
      client.secret = 'secret';
      const token = await generateToken(client, ['abba']);
      const userToken = await generateUserToken(token, 'userId', ['abba']);
      await checkUserToken('userId', userToken, 'abba');
      await checkUserToken('userId', userToken, 'abba2');
      await addToBlacklist(token, userToken);
      await checkUserToken('userId', userToken, 'abba');
    });
    let diff = hd.end();
    let leakObjects = _.filter(diff.change.details, detail => detail.size_bytes / 1024 / 1024 > 3);

    expect(leakObjects.length).to.be.eq(0);
  });


  it('validate timeout for send 100 requests for token less than 20c', async () => {

    const start = Date.now();
    await Promise.map(_.range(0, 100), async () => {
      const client = await models.clientModel.create({
        clientId: uniqid(), 
        secret: await password.hash('secret')
      });
      client.secret = 'secret';
      const token = await generateToken(client, ['abba']);
      await checkToken(ctx.client.clientId, token, 'abba');
      await checkToken(ctx.client.clientId, token, 'abba2');
      await addToBlacklist(token, token);
      await checkUserToken(ctx.client.clientId, token, 'abba');
    });
    expect(Date.now() - start).to.be.below(20000);
  });


  it('validate timeout for send 100 requests for user token less than 20c', async () => {

    const start = Date.now();
    await Promise.map(_.range(0, 100), async () => {
      const client = await models.clientModel.create({
        clientId: uniqid(), 
        secret: await password.hash('secret')
      });
      client.secret = 'secret';
      const token = await generateToken(client, ['abba']);
      const userToken = await generateUserToken(token, 'userId', ['abba']);
      await checkUserToken('userId', userToken, 'abba');
      await checkUserToken('userId', userToken, 'abba2');
      await addToBlacklist(token, userToken);
      await checkUserToken('userId', userToken, 'abba');
    });
    expect(Date.now() - start).to.be.below(20000);
  });




};
