var AccountBalanceTrigger = require('./triggers/AccountBalanceTrigger');
var AccountTriggerField = require('./triggerFields/AccountTriggerField');

function registerAll(ynabApi) {
  // Register AccountBalanceTrigger
  var accountBalanceTrigger = new AccountBalanceTrigger();
  accountBalanceTrigger.registerField(new AccountTriggerField());
  ynabApi.registerTrigger(accountBalanceTrigger);
}

module.exports = registerAll;
