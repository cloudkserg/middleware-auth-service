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
  generateToken = require('../utils/generateToken'),
  generateUserToken = require('../utils/generateUserToken'),
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
  });

  after (async () => {
    delete ctx.client;
    delete ctx.token;
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
    const token = await generateUserToken(ctx.token, 'userId', ['abba', 'bart']);

    const response = await request(`http://localhost:${config.http.port}/user/tokens/check`, {
      method: 'GET',
      json: {
        token,
        userId: 'userId',
        scope: 'abba'
      }
    });
    expect(response.ok).to.equal(true);
  });


};
