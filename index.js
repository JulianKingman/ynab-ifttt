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
  // logger: {log: function(){}, warn: function(){}, error: function(){}, info: function(){}},
  // testAccessToken: '',
  // channelKey: 'ynab_contest',
  channelKey:
    'NGDFodNmYwwm3perWJxTZLwpKWuNDcgML5Nxmw0_UWw-5C5i4vKvypzMc2ABMifR',
});

// this should check ynab to see if it's available
ynabChannel.handlers.status = function(request, callback) {
  fetch('https://api.youneedabudget.com/v1').then(function (response) {
    if (response.ok) {
      callback(null, true);
    }
  })
};

ynabChannel.addExpressRoutes(app);
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('listening on port ', port));
