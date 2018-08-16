// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

// Create example action.
function ExampleAction() {
  ExampleAction.super_.call(this, 'trigger1');
}
util.inherits(ExampleAction, Ifttt.Action);

// Overwrite `_getResponseData` with your response handler.
ExampleAction.prototype._getResponseData = function(req, requestPayload, cb){
  var results = [];

  results.push({
    id: 'id1'
  });

  return cb(null, results);
};

module.exports = ExampleAction;