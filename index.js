var express = require('express');
var app = express();
var Ifttt = require('ifttt');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/oauth2/token', function(req, res) {
  res.send('Hello World');
});

var ynabChannel = new Ifttt({
  apiVersion: 'v1',
  authMode: 'oauth2',
  // logger: console,
  testAccessToken: '1218ecb3fba21a88d1b5270afa12e825d23a37a3b81920d1bcaaad4341638db8',
  // channelKey: 'ynab_contest',
  channelKey: 'NGDFodNmYwwm3perWJxTZLwpKWuNDcgML5Nxmw0_UWw-5C5i4vKvypzMc2ABMifR',
});

ynabChannel.addExpressRoutes(app);

app.listen(process.env.PORT || 3000);
