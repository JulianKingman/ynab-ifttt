const getField = require('./fields/getField');
// Triggers
const AccountBalanceTrigger = require('./triggers/AccountBalanceTrigger');
const TransactionAddedTrigger = require('./triggers/TransactionAddedTrigger');

const AccountTriggerField = getField({ type: 'trigger', slug: 'account' });
const CategoryTriggerField = getField({ type: 'trigger', slug: 'category' });
const PayeeTriggerField = getField({ type: 'trigger', slug: 'payee' });
// Actions
const AddTransactionAction = require('./actions/AddTransactionAction');
const UpdateTransactionAction = require('./actions/UpdateTransactionAction');
const CategoryActionField = getField({ type: 'action', slug: 'category' });
const PayeeActionField = getField({ type: 'action', slug: 'payee' });
const AccountActionField = getField({ type: 'action', slug: 'account' });

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

  // Register Add Transaction action
  const addTransactionAction = new AddTransactionAction();
  addTransactionAction.registerField(new CategoryActionField());
  addTransactionAction.registerField(new PayeeActionField());
  addTransactionAction.registerField(new AccountActionField());
  ynabApi.registerAction(addTransactionAction);

  // Register Update Transaction action
  const updateTransactionAction = new UpdateTransactionAction();
  updateTransactionAction.registerField(new CategoryActionField());
  updateTransactionAction.registerField(new PayeeActionField());
  updateTransactionAction.registerField(new AccountActionField());
  ynabApi.registerAction(updateTransactionAction);
}

module.exports = registerAll;
