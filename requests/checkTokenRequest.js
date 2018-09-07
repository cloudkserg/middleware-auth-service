/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const validate = require('../utils/validate'),
  Joi = require('joi');

const schema = Joi.object().keys({
  id: Joi.string().required(), //client id of checked
  scope: Joi.string().required(), //scope of checked
  token: Joi.string().required(), //token of checked
});

module.exports = (data) => {
  const value = validate(data, schema);
  return {
    id: value.id,
    token: value.token,
    scope: value.scope
  };
};
