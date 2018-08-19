// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

// Create example trigger.
function AddTransaction() {
  AddTransaction.super_.call(this, 'add_transaction');
}
util.inherits(AddTransaction, Ifttt.Action);

// Overwrite `_getResponseData` with your response handler.
AddTransaction.prototype._getResponseData = function(req, requestPayload, cb) {
  var results = [];

  results.push({
    field1: 'value1',
    created_at: new Date().toISOString(),
    meta: {
      id: 'id1',
      timestamp: new Date.now(),
    },
  });

  return cb(null, results);
};

module.exports = AddTransaction;
