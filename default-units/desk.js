'use strict';

module.exports = {
  metadata: {
    plugin: 'desk',
    label: 'Desk',
    role: 'actor',
    family: 'desk',
    deviceTypes: ['desk-proxy/adapter'],
    discoverable: false,
    events: [],
    configuration: [
      {
        label: 'DeskId',
        id: 'deskId',
        type: {
          id: "string",
        }
      }
    ],
    state: [
      {
        label: "Occupied",
        id: "occupied",
        type: {
          id: "boolean",
        }
      },
      {
        label: "user Account",
        id: "userAccount",
        type: {
          id: "srting"
        }
      },
      {
        label: "User Name",
        id: "userName",
        type: {
          id: "srting"
        }
      },
      {
        label: "Expiration Timestamp",
        id: "expirationTimestamp",
        type: {
          id: "integer"
        }
      },
      {
        label: "Error Mmessage",
        id: "errorMessage",
        type: {
          id: "string"
        }
      }      
    ],
    services: [],
    events: [
      {
        id: "occupancyStarted",
        label: "Locker Overdue"
      }, {
        id: "occupancyEnded",
        label: "Occupancy Ended"
      }
    ]
  },
  create: function () {
    return new Desk();
  },
};

function Desk() {
  Desk.prototype.start = function () {
    this.state = {
      occupied: false,
      userAccount: '',
      userName: '',
      expirationTimeStamp: 0,
    }

    return Promise.resolve();
  }

  Desk.prototype.stop = function () {
    return Promise.resolve();
  }

  Desk.prototype.getState = function () {
    return this.state;
  }

  Desk.prototype.setState = function (state) {
    if (this.state.occupied !== state.occupied) {
      if (state.occupied) {
        this.publishEvent('occupancyStarted', {});
      } else {
        this.publishEvent('occupancyEnded', {});
      }
    }
    this.state = state;
  }

  Desk.prototype.occupy = function (user, expirationTime) {
    if (!this.state.occupied) {
      
      const expirationTimeStamp = 
      expirationTime ?
        new Date(expirationTime).getTime() :
        Date.now() + 30 * 60 * 1000;

      this.state.occupied = true;
      this.state.userAccount = user.account;
      this.state.userName = this.device.cutUserAccount(user.account);
      this.state.expirationTimeStamp = expirationTimeStamp;
      return true;
    } else {
      return false;
    }
  }

  Desk.prototype.release = function (user) {
    if (this.checkAccessRights(user)) {
      this.state.occupied = false;
      this.state.userAccount = '';
      this.state.userName = '';
      this.state.expirationTimeStamp = 0;
      return true;
    } else {
      return false;
    }
  }

  Desk.prototype.getDeskInfo = function () {
    const response = {
      deskId: this.configuration.deskId,
      occupied: this.state.occupied
    }
    if (this.state.occupied) {
      response.userName = this.state.userName;
      response.expirationTimeStamp = this.state.expirationTimeStamp;
    }
    return response
  }

  Desk.prototype.checkAccessRights = function (userObject) {
    if (this.state.userAccount === userObject.account) {
      return true;
    }
    else if (Array.isArray(userObject.roles) && userObject.roles.includes(this.device.configuration.releaseRole)) {
      return true;
    }
    return false;
  }
}