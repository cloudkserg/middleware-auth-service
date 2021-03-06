/**
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/
const _ = require('lodash'),
  request = require('request-promise'),
  jwt = require('jsonwebtoken');

// const isAuth = (req) => { 
//   return _.get(req, 'headers.authorization', '') !== ''; };

// const isToken = (nameToken) => { 
//   return nameToken === 'Bearer';
// };

// const hasServiceScope = (tokenData) => {
//   if (!tokenData.scopes) 
//     return false;
//   const scopes = tokenData.scopes;
//   return (scopes.includes && scopes.includes(config.auth.serviceId));
// };

// const checkClientTokenInAuth = async (clientId, token) => {
//   const response = await request({
//     method: 'GET',
//     uri: config.auth.provider + '/tokens/check',
//     json: {
//       id: clientId,
//       scope: config.auth.serviceId,
//       token: token
//     }
//   }).catch(e => {throw e; });
//   return (response.ok == true);
// };


// const checkUserTokenInAuth = async (userId, token) => {
//   const response = await request({
//     method: 'GET',
//     uri: config.auth.provider + '/user/tokens/check',
//     json: {
//       userId: userId,
//       scope: config.auth.serviceId,
//       token: token
//     }
//   }).catch(e => { throw e; });
//   return (response.ok == true);
// };

// const getAuthData = async (request) => {
//   const authorization = _.get(request, 'headers.authorization');
//   const params = authorization.split(' ');
//   if (!isToken(params[0])) 
//     throw new Error('Not set token in headers');
//   const token = params[1];
//   const tokenData = jwt.decode(token);

//   if (!hasServiceScope(tokenData))
//     throw new Error('Not right scope in token');

//   if (!tokenData['clientId']) 
//     throw new Error('Not set clientId in token');

//   if (tokenData['userId'] && (await checkUserTokenInAuth(tokenData['userId'], token)))
//     return {userId: tokenData['userId']};
    
//   if (await checkClientTokenInAuth(tokenData['clientId'], token))
//     return {clientId: tokenData['clientId']};
  
//   throw new Error('Not right auth');
// };


// const TIMEOUT = 10000;

// const getAddressesFromLaborx = async (providerPath, msg) => {
//   const response = await request({
//     method: 'POST',
//     uri: providerPath + '/signin/signature/chronomint',
//     json: true,
//     headers: {
//       'Authorization': msg.req.headers.authorization
//     }
//   });
//   if (_.get(response, 'addresses', null) == null) 
//     throw new Error('not found addresses from auth response ' + response);
//   return response.addresses;
// };

// const findModel = (connection, tableName, msg) => {
//   models = (connection).modelNames();
//   origName = _.find(models, m => m.toLowerCase() === tableName.toLowerCase());
//   if (!origName) {
//     msg.error = {message: 'not right profileModel'};
//     return this.error('not found profileModel in connections', msg);
//   }
//   return connection.models[origName];
// };

// const getAddressesFromMongo = async (profileModel, token) => {
//   const profile = await profileModel.findOne({token});
//   return _.get(profile, 'addresses', null);
// };

// const saveAddressesToMongo = async (profileModel, token, addresses) => {
//   await profileModel.findOneAndUpdate({token}, {$set: {addresses}}, {
//     upsert: true,
//     setDefaultsOnInsert: true
//   });
// };

// const isAuth = (msg) => { return _.get(msg.req, 'headers.authorization', '') !== ''; };

// const isToken = (nameToken) => { 
//   return nameToken === 'Bearer';
// };

// const checkAuth = async (msg, useCacheConfig, profileModel, providerPath) => {
//   const authorization = _.get(msg, 'req.headers.authorization');
//   const params = authorization.split(' ');
//   const useCache = (useCacheConfig && isToken(params[0]));
//   if (useCache) {
//     msg.addresses = await getAddressesFromMongo(profileModel, params[1]);
//     if (msg.addresses) 
//       return msg;
//   }
  
//   let addresses = await getAddressesFromLaborx(providerPath, msg);
//   msg.addresses = addresses;
//   if (useCache) 
//     await saveAddressesToMongo(profileModel, params[1], addresses);
//   return msg;
// }

// module.exports = function (RED) {
//   function ExtractCall (redConfig) {
//     RED.nodes.createNode(this, redConfig);
//     let node = this;

//     const ctx =  node.context().global;
//     const useCacheConfig = _.get(ctx.settings, 'laborx.useCache') || true;

//     let dbAlias, tableName, connection;
//     if (useCacheConfig) {
//       dbAlias = _.get(ctx.settings, 'laborx.dbAlias') || 'profile';
//       tableName = _.get(ctx.settings, 'laborx.profileModel') || 'ctxProfile';
//       connection = _.get(
//         ctx,
//         `connections.primary.${dbAlias}`
//       ) || mongoose;
//     }
    
//     this.on('input', async  (msg) => {
//       let profileModel;
//       if (useCacheConfig) {
//         profileModel = findModel(connection, tableName, msg)
//       }

//       if (!isAuth(msg)) {
//         msg.statusCode = '400';
//         return this.error('Not set authorization headers', msg);
//       }
//       const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : 
//         _.get(ctx.settings, 'laborx.authProvider') || 'http://localhost:3001/api/v1/security';

//       try {
//         await new Promise(async (res, rej) => {
//           await checkAuth(msg, useCacheConfig, profileModel, providerPath)
//             .catch(e => { rej(e);  });
//           res();
//         }).timeout(TIMEOUT);
//       } catch (err) {
//         msg.statusCode = '401';
//         msg.error = err.toString();
//         return this.error('ERROR', msg);
//       }

//       node.send(msg);
//     });
//   }

// module.exports = (config) => {
//   return async (req, response, next) => {
//     if (!isAuth(req)) {
//       response.statusCode = '400';
//       response.send('Not set authorization headers');
//       return;
//     }

//     try {
//       response.locals.data =  await getAuthData(req);
//     } catch(e) {
//       response.statusCode = '401';
//       response.send('Not right authorization ' + e.toString());
//       return;
//     }


//     next();
//   };
// };
