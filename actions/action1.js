// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

// Create example trigger.
function ExampleTrigger() {
  ExampleTrigger.super_.call(this, 'example');
}
util.inherits(ExampleTrigger, Ifttt.Trigger);

// Overwrite `_getResponseData` with your response handler.
ExampleTrigger.prototype._getResponseData = function(req, requestPayload, cb){
  var results = [];

  results.push({
    field1: 'value1',
    created_at: new Date().toISOString(),
    meta: {
      id: 'id1',
      timestamp: new Date.now()
    }
  });

  return cb(null, results);
};

module.exports = ExampleTrigger;