// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');
var ynab = require('ynab');

const ynabApi = require('../ynabApi');

function UpdateTransaction() {
  UpdateTransaction.super_.call(this, 'update_transaction');
}
util.inherits(UpdateTransaction, Ifttt.Action);

// Overwrite `_getResponseData` with your response handler.
UpdateTransaction.prototype._getResponseData = async (
  req,
  requestPayload,
  cb
) => {
  var results = [];

  const amount = requestPayload.payload.actionFields.amount || null;
  const category = requestPayload.payload.actionFields.category || null;
  const account = requestPayload.payload.actionFields.account || null;
  const payee = requestPayload.payload.actionFields.payee || null;
  const flagColor = requestPayload.payload.actionFields.flag_color || null;
  const cleared = requestPayload.payload.actionFields.cleared || null;
  const transactionId =
    requestPayload.payload.actionFields.transaction_id || null;

  const api = ynabApi(req);

  const transaction = await api.transactions
    .updateTransaction('last-used', transactionId, {
      transaction: {
        account_id: account,
        category_id: category,
        payee_id: payee,
        flag_color: flagColor,
        cleared: cleared,
        date: new Date().toISOString(),
        // convert to milliunits
        amount: -amount * 1000,
        approved: false,
        memo: 'asdf',
      },
    })
    .catch(err => console.log(err));

  console.log(transaction);

  return cb(null, [transaction]);
};

module.exports = UpdateTransaction;
