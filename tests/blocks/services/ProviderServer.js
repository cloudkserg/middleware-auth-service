/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const expect = require('chai').expect,
  ProviderService = require('../../../services/ProviderService'),
  constants = require('../../../config/constants')['blockchains'],
  config = require('../../config');

module.exports = () => {


  it('construct with right parameters', async () => {
    const server = new ProviderService(constants.nem, config.node.nem.providers);
    expect(server).instanceOf(ProviderService);
  });

  it('switchConnectorSafe with right parameters', async () => {
    const server = new ProviderService(constants.nem, config.node.nem.providers);
    const connector = await server.switchConnectorSafe();
    expect(connector).to.not.undefined;
  });

  it('get with right parameters', async () => {
    const server = new ProviderService(constants.nem, config.node.nem.providers);
    const connector = await server.get();
    expect(connector).to.not.undefined;
  });
};
