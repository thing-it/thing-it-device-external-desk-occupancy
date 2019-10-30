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

  Adapter.prototype.occupyDesk = function (deskId, userId) {
    let result = false;
    this.actors.forEach(item => {
      if (item.configuration.deskId === deskId) {
        result = item.occupy(userId);
      }
    });
    return result;
  }

  Adapter.prototype.releaseDesk = function (deskId, userId) {
    let result = false;
    this.actors.forEach(item => {
      if (item.configuration.deskId === deskId) {
        result = item.release(userId);
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
}