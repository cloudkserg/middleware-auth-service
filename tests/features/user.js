/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */

const models = require('../../models'),
  config = require('../config'),
  expect = require('chai').expect,
  request = require('request-promise'),
  jwt = require('jsonwebtoken'),
  password = require('../../utils/password');


module.exports = (ctx) => {

  before (async () => {
    await models.tokenModel.deleteMany({});
    await models.clientModel.deleteMany({});

    ctx.client = await models.clientModel.create({
      clientId: 11, 
      secret: await password.hash('secret')});

    const response = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: ctx.client.secret,
        scopes: ['abba']
      }
    });
    ctx.token = response.token;
    expect(ctx.token).to.be.a('string');
  });


  it('POST /user/tokens - create token', async () => {
    const response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: ctx.token,
        userId: 'userId',
        scopes: ['abba']
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);
    const token = jwt.decode(response.token);

    expect(token.clientId).to.equal(ctx.client.clientId);
    expect(token.userId).to.equal('userId');
    expect(token.scopes).deep.equal(['abba']);

  });


  it('GET /user/tokens/check - create token and check that this works', async () => {
    let response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: ctx.token,
        userId: 'userId',
        scopes: ['bart', 'abba']
      }
    });
    const token = response.token;

    response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token,
        userId: 'userId',
        scope: 'abba'
      }
    });
    expect(response.ok).to.equal(true);
  });

  it('POST /tokens/blacklist - create token, check that work, add to blacklist and check that not work', async () => {
    let response = await request(`http://localhost:${config.http.port}/user/tokens`, {
      method: 'POST',
      json: {
        token: ctx.token,
        userId: 'userId',
        scopes: ['bart', 'abba']
      }
    });
    const token = response.token;

    response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token,
        userId: 'userId',
        scope: 'abba'
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);

    response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: ctx.token,
        blackToken: token
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);

    response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token,
        userId: 'userId',
        scope: 'abba'
      }
    }).catch(e => { return e; });
    //after generate address
    expect(response.statusCode).to.equal(400);
    expect(response.error).to.equal('Failure in check user token request');

  });

};
