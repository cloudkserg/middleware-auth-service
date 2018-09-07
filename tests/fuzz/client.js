/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */

const models = require('../../models'),
  config = require('../config'),
  expect = require('chai').expect,
  request = require('request-promise'),
  password = require('../../utils/password');


module.exports = (ctx) => {

  before (async () => {
    await models.tokenModel.deleteMany({});
    await models.clientModel.deleteMany({});

    ctx.client = await models.clientModel.create({
      clientId: 11, 
      secret: await password.hash('secret')
    });
    const tokenResponse = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: ctx.client.secret,
        scopes: ['abba']
      }
    });
    ctx.token = tokenResponse.token;

    const userResponse = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: ctx.token,
        userId: 'userId',
        scopes: ['abba']
      }
    });
    ctx.userToken = userResponse.token;
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
        id: ctx.clientId,
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
        id: ctx.clientId,
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
        id: ctx.clientId,
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

};
