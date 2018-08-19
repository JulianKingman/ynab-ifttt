// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');
var ynab = require('ynab');

var ynabApi = require('../ynabApi');

// Create example action.
function TransactionAdded() {
  TransactionAdded.super_.call(this, 'transaction_added');
}
util.inherits(TransactionAdded, Ifttt.Trigger);

// Overwrite `_getResponseData` with your response handler.
TransactionAdded.prototype._getResponseData = async function(
  req,
  requestPayload,
  cb
) {
  let results = [];
  const api = ynabApi(req);
  const toDollars = n => ynab.utils.convertMilliUnitsToCurrencyAmount(n, 2);
  // TODO: replace this with dynamic value somehow
  const budgetId = 'last-used';
  const accountId = requestPayload.payload.triggerFields.account;
  const minimumInflow = requestPayload.payload.triggerFields.minimum_inflow;
  const minimumOutflow = requestPayload.payload.triggerFields.minimum_outflow;
  const categoryId = requestPayload.payload.triggerFields.category;
  const payee = requestPayload.payload.triggerFields.payee;
  const flagColor = requestPayload.payload.triggerFields.flag_color;

  // last 15 days of data
  let transactions = await api.transactions.getTransactions(
    budgetId,
    new Date(new Date() - 15 * 24 * 60 * 60 * 1000).toISOString()
  );
  transactions = transactions.data.transactions
    .sort((t1, t2) => (t1.date > t2.date ? -1 : t1.date < t2.date ? 1 : 0))
    .filter(t => (
      minimumInflow >= 0
        ? toDollars(t.amount) >= minimumInflow
        : true
      && minimumInflow === -1
        ? t.amount < 0
        : true
      && minimumOutflow >= 0
        ? toDollars(t.amount) <= -minimumOutflow
        : true
      && minimumOutflow === -1
        ? t.amount > 0
        : true
      && accountId !== 'none'
        ? t.account_id === accountId
        : true
      && categoryId !== 'none'
        ? t.category_id === categoryId
        : true
      && payee !== 'none'
        ? t.payee_id === categoryId
        : true
      && flagColor !== 'none'
        ? t.flag_color === flagColor : true
    ));

  transactions = transactions.map(transaction => ({
    amount: toDollars(transaction.amount),
    account: transaction.account_name,
    payee: transaction.payee_name,
    category: transaction.category_name,
    created_at: transaction.date,
    transaction_id: transaction.id,
    meta: {
      id: `day-${transaction.date}`,
      timestamp: Date.now(),
    },
  }))

  cb(null, transactions);
};

module.exports = TransactionAdded;
