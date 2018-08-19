// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

// Create example action.
function AccountBalance() {
  AccountBalance.super_.call(this, 'account_balance');
}
util.inherits(AccountBalance, Ifttt.Trigger);

// Overwrite `_getResponseData` with your response handler.
AccountBalance.prototype._getResponseData = function(req, requestPayload, cb) {
  var results = [];

  // if no budget exists, use last-used
  var budgetId = 'last-used';
  var accountId = requestPayload.payload.triggerFields.account;
  var minBalance = requestPayload.payload.triggerFields.minimum_balance;
  var maxBalance = requestPayload.payload.triggerFields.maximum_balance;
  console.log('account_balance', budgetId, accountId, minBalance, maxBalance);

  ynabApi(req)
    .accounts.getAccountById(budgetId, accountId)
    .then(function(data) {
      var account = data.data.account;
      console.log(account);
      // if (account.balance >=)
      results.push({
        account_balance: account.balance,
        account_name: account.balance,
        minimum_balance: minBalance,
        maximum_balance: maxBalance,
        created_at: new Date().toISOString(),
        meta: {
          id: 'id1',
          timestamp: Date.now(),
        },
      });
      cb(null, results);
    })
    .catch(function(err) {
      console.warn(err);
      cb(err, results);
    });
};

module.exports = AccountBalance;
