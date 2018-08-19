// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

// Create example field.
function AccountField() {
  AccountField.super_.call(this, 'account');

  // Set sample data so IFTTT can properly test this field. For validation purposes.
  this.setOptionsSampleData('valid_option_value', 'invalid_option_value');
}
util.inherits(AccountField, Ifttt.Trigger.TriggerField);

// Overwrite `_getOptionsData` to return field options.
AccountField.prototype._getOptionsData = function(req, response, cb) {
  var api = ynabApi(req);

  api.accounts.getAccounts('last-used').then(function(data) {
    var option = new response.OptionEntity();
    var accounts = data.data.accounts;
    accounts.forEach(function(account) {
      option.setLabel(account.name);
      option.setValue(account.id);
    });
    response.addOption(option);
    cb(null);
  });
};

// Overwrite `_getValidateData` to check if value is valid.
AccountField.prototype._getValidateData = function(req, response, payload, cb) {
  var value = payload.getValue();

  if (value === 'valid_option_value') {
    response.setValid(true);
    return cb(null);
  } else if (value === 'invalid_option_value') {
    response.setValid(false);
    return cb(null);
  }
};

module.exports = AccountField;
