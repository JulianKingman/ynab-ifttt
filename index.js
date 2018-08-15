const Ifttt = require('ifttt');

const ynabChannel = new Ifttt({
  apiVersion: 'v1',
  authMode: 'oauth2',
  // logger: console,
  // testAccessToken: '',
  channelKey: 'ynab_contest',
});

