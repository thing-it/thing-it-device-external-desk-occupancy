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
        label: "User Id",
        id: "userId",
        type: {
          id: "string",
        }
      },
      {
        label: "Dooked At",
        id: "bookedAt",
        type: {
          id: "datetime",
        }
      }
    ],
    services: [
      {
        id: "lock",
        label: "Lock",
      },
      {
        id: "unlock",
        label: "Unlock",
      }
    ],
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
      occupied: false
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

  Desk.prototype.occupy = function (userId) {
    if (!this.state.occupied) {
      this.state.occupied = true;
      this.state.userId = userId;
      this.state.bookedAt = Date.now();
      return true;
    } else {
      return false;
    }
  }

  Desk.prototype.release = function (userId) {
    if (this.state.userId === userId) {
      this.state.occupied = false;
      this.state.userId = undefined;
      this.state.bookedAt = undefined;
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
      response.userId = this.state.userId;
      response.bookedAt = this.state.bookedAt;
    }
    return response
  }
}