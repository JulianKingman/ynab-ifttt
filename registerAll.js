const AccountBalanceTrigger = require('./triggers/AccountBalanceTrigger');
const TransactionAddedTrigger = require('./triggers/TransactionAddedTrigger');
const AccountTriggerField = require('./triggerFields/AccountTriggerField');
const CategoryTriggerField = require('./triggerFields/CategoryTriggerField');
const PayeeTriggerField = require('./triggerFields/PayeeTriggerField');

function registerAll(ynabApi) {
  // Register AccountBalanceTrigger
  const accountBalanceTrigger = new AccountBalanceTrigger();
  accountBalanceTrigger.registerField(new AccountTriggerField());
  ynabApi.registerTrigger(accountBalanceTrigger);

  // Register TransactionAddedTrigger
  const transactionAddedTrigger = new TransactionAddedTrigger();
  transactionAddedTrigger.registerField(new CategoryTriggerField());
  transactionAddedTrigger.registerField(new PayeeTriggerField());
  transactionAddedTrigger.registerField(new AccountTriggerField());
  ynabApi.registerTrigger(transactionAddedTrigger);
}

module.exports = registerAll;
