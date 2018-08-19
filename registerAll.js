const getField = require('./fields/getField');
// Triggers
const AccountBalanceTrigger = require('./triggers/AccountBalanceTrigger');
const TransactionAddedTrigger = require('./triggers/TransactionAddedTrigger');
const AgeOfMoneyTrigger = require('./triggers/AgeOfMoneyTrigger');
const BudgetThresholdTrigger = require('./triggers/BudgetThresholdTrigger');
const ScheduledTransactionTrigger = require('./triggers/ScheduledTransactionTrigger');

const AccountTriggerField = getField({ type: 'trigger', slug: 'account' });
const CategoryTriggerField = getField({ type: 'trigger', slug: 'category' });
const PayeeTriggerField = getField({ type: 'trigger', slug: 'payee' });
const MinValueTriggerField = getField({
  type: 'trigger',
  slug: 'minimum_value',
});
const MaxValueTriggerField = getField({
  type: 'trigger',
  slug: 'maximum_value',
});
const MinOutflowTriggerField = getField({
  type: 'trigger',
  slug: 'minimum_outflow',
});
const MinInflowTriggerField = getField({
  type: 'trigger',
  slug: 'minimum_inflow',
});
const FlagColorTriggerField = getField({ type: 'trigger', slug: 'flag_color' });
const DaysBeforeTriggerField = getField({
  type: 'trigger',
  slug: 'days_before',
});
const PercentUsedTriggerField = getField({
  type: 'trigger',
  slug: 'percent_used',
});
const AmountRemainingTriggerField = getField({
  type: 'trigger',
  slug: 'amount_remaining',
});
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
  accountBalanceTrigger.registerField(new MinValueTriggerField());
  accountBalanceTrigger.registerField(new MaxValueTriggerField());
  ynabApi.registerTrigger(accountBalanceTrigger);

  // Register TransactionAddedTrigger
  const transactionAddedTrigger = new TransactionAddedTrigger();
  transactionAddedTrigger.registerField(new CategoryTriggerField());
  transactionAddedTrigger.registerField(new PayeeTriggerField());
  transactionAddedTrigger.registerField(new AccountTriggerField());
  transactionAddedTrigger.registerField(new MinOutflowTriggerField());
  transactionAddedTrigger.registerField(new MinInflowTriggerField());
  transactionAddedTrigger.registerField(new FlagColorTriggerField());
  ynabApi.registerTrigger(transactionAddedTrigger);

  // Register AgeOfMoneyTrigger
  const ageOfMoneyTrigger = new AgeOfMoneyTrigger();
  ageOfMoneyTrigger.registerField(new MinValueTriggerField());
  ageOfMoneyTrigger.registerField(new MaxValueTriggerField());
  ynabApi.registerTrigger(ageOfMoneyTrigger);

  // Register ScheduledTransactionTrigger
  const scheduledTransactionTrigger = new ScheduledTransactionTrigger();
  scheduledTransactionTrigger.registerField(new DaysBeforeTriggerField());
  ynabApi.registerTrigger(scheduledTransactionTrigger);

  // Register AgeOfMoneyTrigger
  const budgetThresholdTrigger = new BudgetThresholdTrigger();
  budgetThresholdTrigger.registerField(new PercentUsedTriggerField());
  budgetThresholdTrigger.registerField(new AmountRemainingTriggerField());
  budgetThresholdTrigger.registerField(new CategoryTriggerField());
  ynabApi.registerTrigger(budgetThresholdTrigger);

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
