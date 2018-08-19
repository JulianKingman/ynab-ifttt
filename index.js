var express = require('express');
var bodyParser = require('body-parser');
var Ifttt = require('ifttt');
var fetch = require('node-fetch');

var registerAll = require('./registerAll');
var ynabApi = require('./ynabApi');
var AccountBalanceTrigger = require('./triggers/AccountBalanceTrigger');

var app = express();
app.use(bodyParser.json());

// app.get('/', function(req, res) {
//   res.send('Hello World');
// });

// app.post('/oauth2/token', function(req, res) {
//   res.send('Hello World');
// });

var ynabChannel = new Ifttt({
  apiVersion: 'v1',
  authMode: 'oauth2',
  // logger: {log: function(){}, warn: function(){}, error: function(){}, info: function(){}},
  testAccessToken:
    'edb439c89d00c5b1d151224b3f97d7d23a10d886e60f65f6b5d03f3c31c8685d',
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
ynabChannel.handlers.user_info = async (request, callback) => {
  // console.log(Object.keys(ynabApi(request).user));
  // return;
  let data = await fetch('https://api.youneedabudget.com/v1/user', {
    headers: {
      Authorization: request.header('Authorization'),
    },
  }).catch(function(error) {
    console.log('problem', error, request);
  });
  data = await data.json();
  console.log(data);
  var errorMessage = data.error
    ? { message: data.error.name, statusCode: +data.error.id }
    : null;
  var dataResponse = {
    id: data.data && data.data.user && data.data.user.id,
    name: 'ynab-contest',
  };
  console.log('err', errorMessage, dataResponse);
  callback(errorMessage, dataResponse);
};

registerAll(ynabChannel);

ynabChannel.addExpressRoutes(app);

// ynabChannel.oauth2middleware = function (req, res, cb) {}

var port = process.env.PORT || 5000;

app.listen(port, () => console.log('listening on port ', port));
