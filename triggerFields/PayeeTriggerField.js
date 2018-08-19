// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

// Create example field.
function PayeeField() {
  PayeeField.super_.call(this, 'payee');

  this.fieldRequired = false;
  // Set sample data so IFTTT can properly test this field. For validation purposes.
  this.setOptionsSampleData('valid_option_value', 'invalid_option_value');
}
util.inherits(PayeeField, Ifttt.Trigger.TriggerField);

// Overwrite `_getOptionsData` to return field options.
PayeeField.prototype._getOptionsData = async (req, response, cb) => {
  var api = ynabApi(req);
  var option = new response.OptionEntity();

  let payees = await api.payees.getPayees('last-used');
  payees = payees.data.payees;
  payees.forEach(payee => {
    option.setLabel(payee.name);
    option.setValue(payee.id);
  });
  response.addOption(option);
  cb(null);
};

// Overwrite `_getValidateData` to check if value is valid.
PayeeField.prototype._getValidateData = function(req, response, payload, cb) {
  var value = payload.getValue();

  if (value === 'valid_option_value') {
    response.setValid(true);
    return cb(null);
  } else if (value === 'invalid_option_value') {
    response.setValid(false);
    return cb(null);
  }
};

module.exports = PayeeField;
