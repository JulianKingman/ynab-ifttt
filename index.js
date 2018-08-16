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
    'b824d0964f073530ae57597f2fbe9bc2ce570215e746e2afc2dddd52306d8464s',
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
      // console.log('response', response);
      return response.json();
    })
    .then(function(data) {
      var errorMessage = data.error
        ? { message: data.error.name, statusCode: +data.error.id }
        : null;
      var dataResponse = {
        id: data.data && data.data.user && data.data.user.id,
        name: 'ynab-contest',
      };
      console.log('err', errorMessage, dataResponse);
      callback(errorMessage, dataResponse);
    })
    .catch(function(error) {
      console.log('problem', error);
    });
};

// ynabChannel.oauth2middleware = function (req, res, cb) {}

ynabChannel.addExpressRoutes(app);
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('listening on port ', port));
