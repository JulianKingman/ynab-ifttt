// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');
var ynab = require('ynab');

var ynabApi = require('../ynabApi');

// Create example action.
function AccountBalance() {
  AccountBalance.super_.call(this, 'account_balance');
}
util.inherits(AccountBalance, Ifttt.Trigger);

// Overwrite `_getResponseData` with your response handler.
AccountBalance.prototype._getResponseData = async function(
  req,
  requestPayload,
  cb
) {
  let results = [];
  const api = ynabApi(req);
  // TODO: replaces this with dynamic value somehow
  const budgetId = 'last-used';
  const accountId = requestPayload.payload.triggerFields.account;

  let account = await api.accounts
    .getAccountById(budgetId, accountId)
    .catch(function(err) {
      console.warn(err);
      cb(err, results);
    });
  account = account.data.account;
  console.log(account);

  let transactions = await api.transactions.getTransactionsByAccount(
    budgetId,
    account.id,
    new Date(new Date() - 30 * 24 * 60 * 60 * 1000).toISOString()
  );
  transactions = transactions.data.transactions.sort(
    (t1, t2) => (t1.date > t2.date ? -1 : t1.date < t2.date ? 1 : 0)
  );
  // .filter(t => t.cleared === 'cleared');

  const minBalance = requestPayload.payload.triggerFields.minimum_balance;
  const maxBalance = requestPayload.payload.triggerFields.maximum_balance;
  const toDollars = n => ynab.utils.convertMilliUnitsToCurrencyAmount(n, 2);
  const accountBalance = toDollars(account.cleared_balance);

  let transactionSummaryByDay = transactions.reduce(
    (array, transaction, index) => {
      const currentDayIndex = array.findIndex(
        t => t.created_at === transaction.date
      );
      if (currentDayIndex < 0) {
        const yesterday = array[array.length - 1];
        const runningBalance = yesterday
          ? yesterday.account_balance
          : accountBalance;
        console.log(yesterday && yesterday.account_balance);
        return [
          ...array,
          {
            account_balance: runningBalance - toDollars(+transaction.amount),
            account_name: account.name,
            minimum_balance: minBalance,
            maximum_balance: maxBalance,
            created_at: transaction.date,
            meta: {
              id: `day-${transaction.date}`,
              timestamp: Date.now(),
            },
          },
        ];
      } else {
        array[currentDayIndex].account_balance -= toDollars(
          +transaction.amount
        );
      }
      return array;
    },
    []
  );
  transactionSummaryByDay = transactionSummaryByDay.filter(summary => {
    const belowMin = minBalance && summary.account_balance <= minBalance;
    const aboveMax = maxBalance && summary.account_balance >= maxBalance;
    console.log(
      minBalance,
      maxBalance,
      summary.account_balance,
      belowMin,
      aboveMax
    );
    return belowMin || aboveMax;
  });
  console.log(transactionSummaryByDay);

  cb(null, transactionSummaryByDay);
};

module.exports = AccountBalance;
