// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');
var ynab = require('ynab');

var ynabApi = require('../ynabApi');

// Create example action.
function BudgetThreshold() {
  BudgetThreshold.super_.call(this, 'budget_threshold');
}
util.inherits(BudgetThreshold, Ifttt.Trigger);

// Overwrite `_getResponseData` with your response handler.
BudgetThreshold.prototype._getResponseData = async function(
  req,
  requestPayload,
  cb
) {
  let results = [];
  // const api = ynabApi(req);
  // const toDollars = n => ynab.utils.convertMilliUnitsToCurrencyAmount(n, 2);
  // // TODO: replace this with dynamic value somehow
  // const budgetId = 'last-used';
  // const accountId = requestPayload.payload.triggerFields.account;
  // const minimumInflow = requestPayload.payload.triggerFields.minimum_inflow;
  // const minimumOutflow = requestPayload.payload.triggerFields.minimum_outflow;
  // const categoryId = requestPayload.payload.triggerFields.category;
  // const payee = requestPayload.payload.triggerFields.payee;
  // const flagColor = requestPayload.payload.triggerFields.flag_color;

  // transactions = transactions.map(transaction => ({
  //   amount: toDollars(transaction.amount),
  //   account: transaction.account_name,
  //   payee: transaction.payee_name,
  //   category: transaction.category_name,
  //   created_at: transaction.date,
  //   transaction_id: transaction.id,
  //   meta: {
  //     id: `day-${transaction.date}`,
  //     timestamp: Date.now(),
  //   },
  // }))

  cb(null, results);
};

module.exports = BudgetThreshold;
