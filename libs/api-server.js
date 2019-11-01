'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const Token = require('./token');

// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';


class ApiServer {
  constructor(configuration, adapter) {
    return new Promise((resolve) => {
      this.adapter = adapter;
      this.expressApp = express();
      this.token = new Token({
        'keyPath': configuration.privateKeyPath,
        'keyType': 'private',
      });

      this.expressApp.use(cookieParser());
      this.expressApp.use(bodyParser.json());
      this.expressApp.use(bodyParser.urlencoded({ extended: false }));
      this.expressApp.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
      });
      this.expressApp.use((req, res, next) => {
        if (req.headers.authorization) {
          let tokenParts = req.headers.authorization.split(' ');
          if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            try {
              if (this.token.decode(tokenParts[1]) !== '') {
                return next();
              }
            } catch (e) {
              return res.status(401).send('Unauthorized, wrong key')
            }
          }
        }
        res.status(401).send('Unauthorized')
      });

      this.expressApp.get('/desks', (req, res) => {
        return res.json(this.adapter.getState());
      });
      this.expressApp.get('/desks/:deskId', (req, res) => {
        if (req.params.deskId) {
          return res.json(this.adapter.getState(req.params.deskId));
        } else {
          return res.status(422).send('Unprocessable Entity')
        }
      });

      this.expressApp.put('/desks/:deskId/occupy', (req, res) => {
        if (req.params.deskId && req.body.user) {
          //TODO: need rfactoring runing foreach only one time (1 occupyDesk & 1 getState)
          let user = JSON.parse(req.body.user);
          const occupationResult = this.adapter.occupyDesk(req.params.deskId, user);
          if (occupationResult) {
            return res.json(this.adapter.getState(req.params.deskId));
          } else {
            return res.status(409).send('Conflict, desk already occupied')
          }
        } else {
          return res.status(422).send('Unprocessable Entity')
        }
      });

      this.expressApp.put('/desks/:deskId/release', (req, res) => {
        if (req.params.deskId && req.body.user) {
          let user = JSON.parse(req.body.user);
          const result = this.adapter.releaseDesk(req.params.deskId, user);
          if (result) {
            return res.json(this.adapter.getState(req.params.deskId));
          } else {
            return res.status(409).send('Conflict, wrong user')
          }
        } else {
          return res.status(422).send('Unprocessable Entity')
        }
      });

      this.expressApp.listen(configuration.port, () => {
        resolve();
      });
    });
  }

}

module.exports = ApiServer;