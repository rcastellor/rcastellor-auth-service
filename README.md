<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[rcastellor-auth-service](https://github.com/rcastellor/rcastellor-auth-service) is an autentication service for distributed applications.

The service publish an API to signup, signin, refresh session for modern SPA applications.

The service makes use of severals standards to manage security:

* [JWT](https://jwt.io/) signed tokens
* [RSA](https://es.wikipedia.org/wiki/RSA) algorithm with public and private keys
* [UUID](https://datatracker.ietf.org/doc/html/rfc4122) generation algorithms

The service flow starts with the signup of users into the system, a minimal data is required, the underlaying database is mysql.

Once the user is validated into the system he can signin for an access_token and a refresh token, the access_token is a field of the /signin response, it's a JWT token signed with the RSA private key and has the uuid of the user in the sub claim.

The access_token has a short expired period and can be used to access resources based on the uuid of the user.

The refresh token is a httponly secured cookie, it only has to be sent to the refresh endpoint, if the refresh token is valid would the refresh endpoint return a new access_token to be used by the application and the next refresh token.

There are some risks in this implementation, if the access_token is stolen it can be used until his expiration (the reason of short periods). 
The refresh token can be used only one time, if it's stolen and there is more than one use of the same refresh token all the live refresh tokens would be invalidated and to get a new access_token the user is forced to use his credentials again to start a session into the app. 

This is a [good post](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/) about how refresh token works in this kind applications and why this approach.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Dockerize

```bash
$ docker build .
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Roberto Castellor](https://www.castellor.es)
- Twitter - [@rcastellor](https://twitter.com/rcastellor)

## License

Nest is [GNUv3 licensed](LICENSE).
