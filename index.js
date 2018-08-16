var express = require('express');
var app = express();
var Ifttt = require('ifttt');
var fetch = require('node-fetch');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.post('/oauth2/token', function(req, res) {
  res.send('Hello World');
});

var ynabChannel = new Ifttt({
  apiVersion: 'v1',
  authMode: 'oauth2',
  // logger: {log: function(){}, warn: function(){}, error: function(){}, info: function(){}},
  testAccessToken:
    'fad60d5893c18fa54d091591eb861ab8bf260ba8a759c1b4b74c9c904d7055b6',
  // channelKey: 'ynab_contest',
  channelKey:
    'NGDFodNmYwwm3perWJxTZLwpKWuNDcgML5Nxmw0_UWw-5C5i4vKvypzMc2ABMifR',
});

// this should check ynab to see if it's available
ynabChannel.handlers.status = function(request, callback) {
  fetch('https://api.youneedabudget.com/v1').then(function(response) {
    if (response.ok) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

// make sure user can authorize
ynabChannel.handlers.user_info = function(request, callback) {
  var token = request.header('Authorization');
  fetch('https://api.youneedabudget.com/v1/user', {
    headers: { Authorization: token },
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(data) {
      console.log(data);
      callback(null, { data: { id: data.data.user.id, name: 'ynab-contest' } });
    });
};

// ynabChannel.oauth2middleware = function (req, res, cb) {}

ynabChannel.addExpressRoutes(app);
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('listening on port ', port));
