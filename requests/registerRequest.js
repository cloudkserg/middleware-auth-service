/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const validate = require('../utils/validate'),
  Joi = require('joi');

const schema = Joi.object().keys({
  id: Joi.string().required(), //if of client
  secret: Joi.string().lowercase().required(),
});

/**
 * @param {{id: String, secret: String}}
 * @returns {{id: String, secret: String}}
 */
module.exports = (data) => {
  const value = validate(data, schema);
  return {
    id: value.id,
    secret: value.secret
  };
};
