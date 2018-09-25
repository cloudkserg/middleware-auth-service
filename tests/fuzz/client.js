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
    ctx.client.secret = 'secret';
    ctx.token = await generateToken(ctx.client, ['abba']);
    ctx.userToken = await generateUserToken(ctx.token, 'userId', ['abba']);
  });

  after (async () => {
    delete ctx.client;
    delete ctx.token;
    delete ctx.userToken;
  });



  it('POST /tokens - without params - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {}
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens - with not right secret - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: 'not right',
        scopes: ['abba']
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });


  it('POST /tokens/refresh - without params - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/refresh`, {
      method: 'POST',
      json: {}
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/refresh - with not right token - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/refresh`, {
      method: 'POST',
      json: {
        token: 'not_right_param'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/refresh - with user token - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/refresh`, {
      method: 'POST',
      json: {
        token: ctx.userToken
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/refresh - with not refresh token - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/refresh`, {
      method: 'POST',
      json: {
        token: ctx.token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/refresh - with black token - error', async () => {
    let response = await generateToken(ctx.client, ['abba'], true);
    const refreshToken = response.refreshToken;

    await addToBlacklist(ctx.token, refreshToken);

    response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: refreshToken
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });
    
  it('POST /tokens/blacklist - without params - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/blacklist - with not right params - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: 'not right token',
        blackToken: ctx.token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/blacklist - with userToken - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: ctx.userToken,
        blackToken: ctx.token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('POST /tokens/blacklist - with blacklist token - error', async () => {
    const token = await generateToken(ctx.client, ['abba']);
    await addToBlacklist(ctx.token, token);

    const response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: token,
        blackToken: ctx.token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /tokens/check - without params - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /tokens/check - with not right params - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        scope: 'abba', 
        token: 'sfsdf'
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /tokens/check - with user token  - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        scope: 'abba', 
        token: ctx.userToken
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /tokens/check - with not right scope  - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        scope: 'bart', 
        token: ctx.token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });

  it('GET /tokens/check - with not right clientId  - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: '19',
        scope: 'bart', 
        token: ctx.token
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });


  it('GET /tokens/check - with black token  - error', async () => {
    const mainToken = await generateToken(ctx.client, ['auth']);
    const token = await generateToken(ctx.client, ['abba']);
    await addToBlacklist(mainToken, token);

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


};
