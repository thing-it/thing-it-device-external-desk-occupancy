'use strict'

module.exports = {
  metadata: {
    family: 'desk-proxy',
    plugin: 'adapter',
    label: 'Desk Ocupancy Adapter',
    manufacturer: '',
    discoverable: true,
    additionalSoftware: [],
    actorTypes: [],
    sensorTypes: [],
    services: [
    ],
    configuration: [
      {
        label: 'API Port',
        id: 'apiPort',
        type: {
          id: 'integer',
        },
        defaultValue: '',
      },
      {
        label: 'releaseRole',
        id: 'releaseRole',
        type: {
          id: 'string'
        },
        defaultValue: ''
      }
    ],
    state: [],
  },
  create: function () {
    return new Adapter();
  }
}

const ApiServer = require('./libs/api-server');
Promise.prototype.fail = Promise.prototype.catch;

function Adapter() {

  Adapter.prototype.start = function () {
    const configurationObject = {
      port: this.configuration.apiPort,
      privateKeyPath: './cert/private.key'
    };

    this.apiServer = new ApiServer(configurationObject, this);
    return Promise.resolve();
  }

  Adapter.prototype.stop = function () {

  }

  Adapter.prototype.occupyDesk = function (deskId, user) {
    let result = false;
    this.actors.forEach(item => {
      if (item.configuration.deskId === deskId) {
        result = item.occupy(user);
      }
    });
    return result;
  }

  Adapter.prototype.releaseDesk = function (deskId, user) {
    let result = false;
    this.actors.forEach(item => {
      if (item.configuration.deskId === deskId) {
        result = item.release(user);
      }
    });
    return result;
  }

  Adapter.prototype.getState = function (deskId) {
    const response = [];
    if (deskId) {
      this.actors.forEach((item => {
        if (item.type === 'desk' && item.configuration.deskId === deskId) {
          response.push(item.getDeskInfo());
        }
      }))
    } else {
      this.actors.forEach((item => {
        if (item.type === 'desk') {
          response.push(item.getDeskInfo());
        }
      }))
    }
    return response;
  }

  Adapter.prototype.cutUserAccount = function (userAccount) {
    const accountParts = userAccount.split('@');
    let cutUserName = '';
    if (accountParts.length === 2) {
      cutUserName = accountParts[0][0] + '*' + accountParts[0][accountParts[0].length - 1] + '@';
      const dommainParts = accountParts[1].split('.');
      if (dommainParts.length >= 2) {
        cutUserName = cutUserName
          + dommainParts[0][0]
          + '*'
          + dommainParts[dommainParts.length - 2][dommainParts[dommainParts.length - 2].length - 1]
          + '.' + dommainParts[dommainParts.length - 1];
      } else {
        cutUserName = cutUserName + accountParts[1];
      }
    } else {
      cutUserName = userAccount[0] + '*' + userAccount[userAccount.length - 1];
    }
    return cutUserName;
  }
}