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
  addToBlacklist = require('../utils/addToBlacklist'),
  password = require('../../utils/password');



module.exports = (ctx) => {

  before (async () => {
    await models.tokenModel.deleteMany({});
    await models.clientModel.deleteMany({});

    ctx.client = await models.clientModel.create({
      clientId: 11, 
      secret: await password.hash('secret')
    });
    ctx.token = await generateToken(ctx.client, ['abba']);
    ctx.userToken = await generateUserToken(ctx.token, 'userId', ['abba']);
  });

  after (async () => {
    delete ctx.client;
    delete ctx.token;
    delete ctx.userToken;
  });


  it('POST /user/tokens - without parameters - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);

  });


  it('POST /user/tokens - with not right token - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: 'sdfsdfsd',
        userId: 'userId',
        scopes: ['bart', 'abba']
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);

  });


  it('POST /user/tokens - with user token - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: ctx.userToken,
        userId: 'userId',
        scopes: ['bart', 'abba']
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);

  });

  it('POST /user/tokens - with black token - error', async () => {
    const token = generateToken(ctx.client, ['abba']);
    await addToBlacklist(token, token);

    const response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: token,
        userId: 'userId',
        scopes: ['bart', 'abba']
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);

  });


  it('GET /user/tokens/check - without parameters - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /user/tokens/check - with not right token - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token: 'adasdas',
        scope: 'abba',
        userId: 'userId'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });



  it('GET /user/tokens/check - with not right scope - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token: ctx.userToken,
        scope: 'bart',
        userId: 'userId'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /user/tokens/check - with not right userId - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token: ctx.userToken,
        scope: 'abba',
        userId: 'clientId'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /user/tokens/check - with clientToken - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token: ctx.token,
        scope: 'abba',
        userId: 'clientId'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /user/tokens/check - with blacklist token - error', async () => {
    const token = generateToken(ctx.client, ['abba']);
    const userToken = generateUserToken(token, 'userId', 'abba');
    await addToBlacklist(token, userToken);
    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token: userToken,
        scope: 'abba',
        userId: 'userId'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });


};
