/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const validate = require('../utils/validate'),
  Joi = require('joi');

const schema = Joi.object().keys({
  token: Joi.string().required() //refresh token
});

module.exports = (data) => {
  const value = validate(data, schema);
  return {
    token: value.token,
  };
};
