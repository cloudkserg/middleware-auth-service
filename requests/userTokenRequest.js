/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const validate = require('../utils/validate'),
  Joi = require('joi');

const schema = Joi.object().keys({
  token: Joi.string().required(), // token of client (only client, exists check on it)
  userId: Joi.string().required(), //id of user
  scopes: Joi.array().items(Joi.string()).required() //scopes for user token
});

module.exports = (data) => {
  const value = validate(data, schema);
  return {
    userId: value.userId,
    token: value.token,
    scopes: value.scopes
  };
};
