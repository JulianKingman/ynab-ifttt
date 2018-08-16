var express = require('express');
var app = express();
var Ifttt = require('ifttt');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/oauth2/token', function(req, res) {
  res.send('Hello World');
});

var ynabChannel = new Ifttt({
  apiVersion: 'v1',
  // authMode: 'oauth2',
  // logger: console,
  // testAccessToken: '',
  // channelKey: 'ynab_contest',
  channelKey:
    'NGDFodNmYwwm3perWJxTZLwpKWuNDcgML5Nxmw0_UWw-5C5i4vKvypzMc2ABMifR',
});

ynabChannel.handlers.status = function(a, b, c) {
  console.log(a, b, c);
};

ynabChannel.addExpressRoutes(app);
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('listening on port ', port));
