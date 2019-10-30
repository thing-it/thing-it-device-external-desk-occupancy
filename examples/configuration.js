module.exports = {
  "label": "Default",
  "id": "default",
  "autoDiscoveryDeviceTypes": [],
  "devices": [
    {
      "plugin": "desk-proxy/adapter",
      "actors": [
        {
          id: 'desk-01',
          label: 'Desk 01',
          type: 'desk',
          logLevel: 'debug',
          configuration: {
            deskId: '1'
          }
        },{
          id: 'desk-02',
          label: 'Desk 02',
          type: 'desk',
          logLevel: 'debug',
          configuration: {
            deskId: '2'
          }
        },{
          id: 'desk-03',
          label: 'Desk 03',
          type: 'desk',
          logLevel: 'debug',
          configuration: {
            deskId: '3'
          }
        },{
          id: 'desk-04',
          label: 'Desk 04',
          type: 'desk',
          logLevel: 'debug',
          configuration: {
            deskId: '4'
          }
        }
      ],
      "sensors": [],
      "services": [],
      "class": "Device",
      "id": "adapter01",
      "label": "Adapter 01",
      "logLevel": "debug",
      "configuration": {
        "simulated": false,
        "apiPort": 8443,
        "releaseRole": "desk-administrtator"
      }
    }],
  "services": [],
  "eventProcessors": [],
  "groups": [],
  "jobs": [],
  "data": []
};
