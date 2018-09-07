/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
const bcrypt = require('bcrypt'),
  Promise = require('bluebird'),
  saltRounds = 10;

module.exports = {
  hash: async (password) => {
    return await new Promise((res, rej) => {
      bcrypt.genSalt(saltRounds, (error, salt) => {
        if (error)
          rej(error);
        bcrypt.hash(password, salt, (error, digest) => {
          error ? rej(error) : res(digest);
        });
      });
    });

  },
  check: async (password, hash) => {
    return await new Promise((res, rej) => {
      bcrypt.compare(password, hash, (error, result) => {
        error ? rej(error) : res(result);
      });
    });
  }
};
