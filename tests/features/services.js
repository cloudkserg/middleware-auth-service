/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */

const models = require('../../models'),
  config = require('../config'),
  password = require('../../utils/password'),
  expect = require('chai').expect,
  generateToken = require('../utils/generateToken'),
  checkToken = require('../utils/checkToken'),
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


  it('POST /services - create duplicate service - remains old service with old password', async () => {
    const response = await request(`http://localhost:${config.http.port}/services`, {
      method: 'POST',
      json: {
        id: 'service',
        secret: 'password1'
      }
    });
    //after generate address
    expect(response.ok).to.equal(true);


    const clients = await models.clientModel.find({clientId: 'service'});
    expect(clients.length).to.equal(1);

    expect(await password.check('password', clients[0].secret)).to.equal(true);
  });

  it('POST /services - create service and create token', async () => {
    await request(`http://localhost:${config.http.port}/services`, {
      method: 'POST',
      json: {
        id: 'service2',
        secret: 'password'
      }
    });

    const token = await generateToken({clientId: 'service', secret: 'password'}, ['abba']);
    const result = await checkToken('service', token, 'abba');
    expect(result).to.be.equal(true);
  });

};
