/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const validate = require('../utils/validate'),
  Joi = require('joi');

const schema = Joi.object().keys({
  scope: Joi.string().required(), //scope of checked
  token: Joi.string().required(), //userToken of checked
  userId: Joi.string().required() //userId of checked
});

module.exports = (data) => {
  const value = validate(data, schema);
  return {
    token: value.token,
    scope: value.scope,
    userId: value.userId
  };
};
