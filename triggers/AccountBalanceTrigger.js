// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

// Create example action.
function AccountBalance() {
  AccountBalance.super_.call(this, 'account_balance');
}
util.inherits(AccountBalance, Ifttt.Action);

// Overwrite `_getResponseData` with your response handler.
AccountBalance.prototype._getResponseData = function(req, requestPayload, cb) {
  var results = [];

  // if no budget exists, use last-used
  var budgetId = requestPayload.payload.actionFields.budget || 'last-used';
  console.log('using budgetId:', budgetId, req.header('Authorization'));

  ynabApi(req)
    .accounts.getAccountById(budgetId, accountId)
    .then(function(data) {
      var accounts = data.data.accounts;
      console.log(accounts);
      accounts.forEach(function(account) {
        results.push({
          label: account.name,
          value: account.id,
        });
      });
      cb(null, results);
    })
    .catch(function(err) {
      console.warn(err);
      cb(err, results);
    });
};

module.exports = AccountBalance;
