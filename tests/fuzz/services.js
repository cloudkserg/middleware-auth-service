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

  it('POST /services - without parameters  - error', async () => {
    const response = await request(`http://localhost:${config.http.port}/services`, {
      method: 'POST',
      json: {
      }
    }).catch(e => { return e; });
    expect(response.statusCode).to.equal(400);
  });
};
