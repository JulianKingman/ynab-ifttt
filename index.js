var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World');
});

const Ifttt = require('ifttt');

const ynabChannel = new Ifttt({
  apiVersion: 'v1',
  authMode: 'oauth2',
  // logger: console,
  // testAccessToken: '',
  channelKey: 'ynab_contest',
});

app.listen(80);
