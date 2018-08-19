// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

// Create example field.
function BudgetField() {
  BudgetField.super_.call(this, 'budget');

  // Set sample data so IFTTT can properly test this field. For validation purposes.
  // this.setOptionsSampleData('Checking Account', 'invalid_option_value');
}
util.inherits(BudgetField, Ifttt.Trigger.TriggerField);

// Overwrite `_getOptionsData` to return field options.
BudgetField.prototype._getOptionsData = function(req, response, cb) {
  ynabApi(req)
    .accounts.getAccounts()
    .then(function(accounts) {
      var option = new response.OptionEntity();
      accounts.forEach(function(account) {
        option.setLabel(account.name);
        option.setValue(account.id);
      });
      response.addOption(option);
      cb(null);
    });
};

// Overwrite `_getValidateData` to check if value is valid.
BudgetField.prototype._getValidateData = function(
  req,
  response,
  payload,
  cb
) {
  var value = payload.getValue();

  if (value === 'valid_option_value') {
    response.setValid(true);
    return cb(null);
  } else if (value === 'invalid_option_value') {
    response.setValid(false);
    return cb(null);
  }
};

module.exports = BudgetField;
