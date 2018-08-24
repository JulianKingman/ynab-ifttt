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
  let updates = {};
  const actionFields = requestPayload.payload.actionFields;

  if (actionFields.amount) updates.amount = actionFields.amount * 1000;
  if (actionFields.category) updates.category = actionFields.category;
  if (actionFields.account) updates.account = actionFields.account;
  if (actionFields.payee) updates.payee = actionFields.payee;
  if (actionFields.flag_color) updates.flagColor = actionFields.flag_color;
  if (actionFields.cleared) updates.cleared = actionFields.cleared;
  if (actionFields.memo) updates.transactionId = actionFields.memo;
  const transactionId = actionFields.transaction_id;
  console.log(`updatetransaction action triggered with ${actionFields}`);

  const api = ynabApi(req);

  const transaction = await api.transactions
    .updateTransaction('last-used', transactionId, {
      transaction: updates,
    })
    .catch(err => console.log(err));

  console.log(transaction);

  return cb(null, [transaction]);
};

module.exports = UpdateTransaction;
