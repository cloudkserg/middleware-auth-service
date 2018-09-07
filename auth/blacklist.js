/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const models = require('../models');

module.exports = {
  add: async (token) => {
    await models.tokenModel.findOneAndUpdate({token}, {token}, {upsert: true});
  },
  has: async (token) => {
    return (await models.tokenModel.countDocuments({token}) > 0);
  }
};

