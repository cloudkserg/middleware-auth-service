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
  });


  it('POST /tokens - create token - get response with {token, refreshToken}', async () => {
    const response = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: ctx.client.secret,
        scopes: ['abba']
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);
    const token = jwt.decode(response.token);
    const refreshToken = jwt.decode(response.refreshToken);

    expect(token.clientId).to.equal(ctx.client.clientId);
    expect(token.scopes).deep.equal(['abba']);

    expect(refreshToken.clientId).to.equal(ctx.client.clientId);
    expect(refreshToken.scopes).deep.equal(['abba']);
  });


  it('POST /tokens/refresh - create tokens on post /tokens, refresh tokens, and check this work ', async () => {
    const responseOne = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: ctx.client.secret,
        scopes: ['abba']
      }
    });
    const refreshToken = responseOne.refreshToken;

    const response = await request(`http://localhost:${config.http.port}/tokens/refresh`, {
      method: 'POST',
      json: {
        token: refreshToken
      }
    });
    expect(response.ok).to.equal(true);
    const token = jwt.decode(response.token);

    expect(token.clientId).to.equal(ctx.client.clientId);
    expect(token.scopes).deep.equal(['abba']);

    const responseTwo = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        token: response.token,
        scope: 'abba'
      }
    });
    //after generate address
    expect(responseTwo.ok).to.equal(true);

  });

  it('POST /tokens/blacklist - create token, check that work, add to blacklist and check that not work', async () => {
    let response = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: ctx.client.secret,
        scopes: ['abba']
      }
    });
    const token = response.token;

    response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        token: token,
        scope: 'abba'
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);

    response = await request(`http://localhost:${config.http.port}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: token,
        blackToken: token
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);

    response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        token: token,
        scope: 'abba'
      }
    }).catch(e => { return e; });
    //after generate address
    expect(response.statusCode).to.equal(400);
    expect(response.error).to.equal('Failure in check token request');

  });


  it('GET /tokens/check - create tokens and check that token works', async () => {
    const responseOne = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: ctx.client.clientId,
        secret: ctx.client.secret,
        scopes: ['abba', 'bart']
      }
    });

    const response = await request(`http://localhost:${config.http.port}/tokens/check`, {
      method: 'GET',
      json: {
        id: ctx.client.clientId,
        token: responseOne.token,
        scope: 'bart'
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);
  });

};
