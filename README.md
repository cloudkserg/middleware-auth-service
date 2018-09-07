# middleware-auth-service [![Build Status](https://travis-ci.org/ChronoBank/middleware-auth-service.svg?branch=master)](https://travis-ci.org/ChronoBank/middleware-auth-service)

Middleware service for auth services

### Installation

This module is a part of middleware services. You can install it in 2 ways:

1) through core middleware installer  [middleware installer](https://github.com/ChronoBank/middleware)
2) by hands: just clone the repo, do 'npm install', set your .env - and you are ready to go


#### About
This module is used for create and check tokens for other services and his users.


#### How does it work?


We have three services.

Client Service - service, that request operation on server service.
Server Service - service, that need do operation from client service.
Auth Service - this service, that used to authorize client service on server service.


When Client service request operation on Server service, 
it send with data on request selected fields:
```
BODY:
token - {String} appropriate token for server service
id - {String} client id
```

Then Server service make request on Auth service
```
GET /tokens/check

with body
token - {String} sended from client token
id - {String} sended from client id
scope - {String} own service id 
```
If response = {ok: true}, that server may done operation for this client, another don't.

#### Tokens

- token - need for operation on another services from clientId
exists only env.JWT_EXPIRES seconds

- refreshToken - only need for operation refresh on this service
exists only env.JWT_REFRESH_EXPIRES seconds

- userToken - need for operation on another services from userId

ALL TOKENS, IF ADD TO BLACKLIST, NOT WORKED.


#### Scheme of logick with services


## Register service
```
Client  --> Auth

POST /services

Request:
id - {String} clientId
secret - {String} secret of clientId

Response:
{ok: true}
```

#### Scheme of logick with client tokens

## Create token

```
Client  --> Auth

POST /tokens

Request:
id - {String} clientId
secret - {String} secret of clientId
scopes - {String[]} strings of ids, that client has access

Response:
{ok: true, token: {String}, refreshToken: {String}}
```
## Check token

```
Server -->  Auth

GET /tokens/check

Request:
id - {String} clientId
token - {String} checked token
scope - {String}  server id

Response:
{ok: true}
```

## Refresh token

```
Client -->  Auth

POST /tokens/refresh

Request:
token - {String} refresh token

Response:
{ok: true, token: {String}}
```


### Add token or userToken to Blacklist

```
Client -->  Auth

POST /tokens/blacklist

Request:
token - {String} client token
blackToken - {String} token to black list [my user or client token] 

Response:
{ok: true}
```

#### Scheme of logick with user tokens

## Create token

```
Client  --> Auth

POST /user/tokens

Request:
token - {String} woked token of client
userId - {String} userId
scopes - {String[]} strings of ids, that user has access

Response:
{ok: true, token: {String}}
```
## Check token

```
Server -->  Auth

GET /user/tokens/check

Request:
id - {String} userId
token - {String} checked token
scope - {String} server id

Response:
{ok: true}
```

##### сonfigure your .env

To apply your configuration, create a .env file in root folder of repo (in case it's not present already).
Below is the expamle configuration:

```
REST_PORT=8082
JWT_SECRET=sfsdlfjlwkjlk23048239048kljdklfsjl
JWT_EXPIRES=600
JWT_REFRESH_EXPIRES=6000
```


    port: parseInt(process.env.REST_PORT) || 8081,
  },
  mongo: {
    collectionPrefix: process.env.MONGO_COLLECTION_PREFIX || 'auth_service',
    data: { uri: process.env.MONGO_URI || 'mongodb://localhost:27017/data' }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES || 600,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || 6000
The options are presented below:

| name | description|
| ------ | ------ |
| REST_PORT   | http port for work this middleware
| MONGO_URI   | the URI string for mongo connection
| MONGO_COLLECTION_PREFIX   | the default prefix for all mongo collections. The default value is 'tx_service'
| JWT_SECRET | the key -string for generate jwt tokens
| JWT_EXPIRES | the time, for which live tokens | default = 600c
| JWT_REFRESH_EXPIRES | the time, for which live tokens | default = 6000c


License
----
 [GNU AGPLv3](LICENSE)


Copyright
----
LaborX PTY
