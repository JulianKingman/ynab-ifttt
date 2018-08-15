var express = require('express');
var app = express();
var Ifttt = require('ifttt');

app.get('/', function(req, res) {
  res.send('Hello World');
});

var ynabChannel = new Ifttt({
  apiVersion: 'v1',
  authMode: 'oauth2',
  // logger: console,
  // testAccessToken: '',
  channelKey: 'ynab_contest',
});

ynabChannel.addExpressRoutes(app);

app.listen(process.env.PORT || 3000);
