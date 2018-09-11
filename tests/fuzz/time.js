/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */

const models = require('../../models'),
  config = require('../config'),
  expect = require('chai').expect,
  request = require('request-promise'),
  generateToken = require('../utils/generateToken'),
  generateUserToken = require('../utils/generateUserToken'),
  spawn = require('child_process').spawn,
  password = require('../../utils/password');



module.exports = (ctx) => {
  before (async () => {
    await models.tokenModel.deleteMany({});
    await models.clientModel.deleteMany({});

    ctx.serverPid.kill();
    await Promise.delay(2000);
    
    const env = process.env;
    env.JWT_EXPIRES = 2;
    env.JWT_REFRESH_EXPIRES = 5;
    ctx.serverPid = spawn('node', ['index.js'], {env: process.env, stdio: 'inherit'});
    await Promise.delay(5000);

    ctx.client = await models.clientModel.create({
      clientId: 11, 
      secret: await password.hash('secret')
    });
  });
  
  after (async () => {
    delete ctx.client;

    ctx.serverPid.kill();
    await Promise.delay(2000);

    ctx.serverPid = spawn('node', ['index.js'], {env: process.env, stdio: 'inherit'});
    await Promise.delay(5000);
  });


  it('GET /tokens/check - await timeout error, that check - error', async () => {
    const token = generateToken(ctx.client, ['abba']);
    await Promise.delay(3000);
    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        scope: 'abba',
        token: token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /user/tokens/check - await timeout error for userToken, that check - error', async () => {
    const token = generateToken(ctx.client, ['abba']);
    const userToken = generateUserToken(token, 'userId', ['abba']);
    await Promise.delay(3000);
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        userId: 'userId',
        scope: 'abba',
        token: userToken
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });


  it('POST /tokens/refresh - await timeout error for refresh, that check - error', async () => {
    let response = generateToken(ctx.client, ['abba'], true);
    const refreshToken = response.refreshToken;
    await Promise.delay(3000);
    response = await request(`http://localhost:${config.http.port}/tokens/refresh`, {
      method: 'POST',
      json: {
        token: refreshToken
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/blacklist - await timeout error for token, that check - error', async () => {
    const token = generateToken(ctx.client, ['abba']);
    await Promise.delay(3000);
    const response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: token,
        blackToken: token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /user/tokens - await timeout error for token, that check - error', async () => {
    const token = generateToken(ctx.client, ['abba']);
    await Promise.delay(3000);
    const response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        userId: 'userId',
        scopes: ['abba'],
        token: token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

};
  