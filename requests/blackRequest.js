/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const validate = require('../utils/validate'),
  Joi = require('joi');

const schema = Joi.object().keys({
  token: Joi.string().required(), //token of client, when request add to black
  blackToken: Joi.string().required(), //token, that blacked
});

module.exports = (data) => {
  const value = validate(data, schema);
  return {
    token: value.token,
    blackToken: value.blackToken
  };
};
