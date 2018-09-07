/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */

const models = require('../../models'),
  config = require('../config'),
  expect = require('chai').expect,
  request = require('request-promise');


module.exports = (ctx) => {

  before (async () => {
    await models.tokenModel.deleteMany({});
    await models.clientModel.deleteMany({});

  });


  it('POST /services - create service', async () => {
    const response = await request(`http://localhost:${config.http.port}/services`, {
      method: 'POST',
      json: {
        id: 'service',
        secret: 'password'
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);
  });

  it('POST /services - create service and create token', async () => {
    await request(`http://localhost:${config.http.port}/services`, {
      method: 'POST',
      json: {
        id: 'service2',
        secret: 'password'
      }
    });


    const response = await request(`http://localhost:${config.http.port}/tokens`, {
      method: 'POST',
      json: {
        id: 'service',
        secret: 'password',
        scopes: ['abba']
      }
    });
    expect(response.ok).to.be.equal(true);
  });

};
