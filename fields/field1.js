// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

// Create example field.
function ExampleField() {
  ExampleField.super_.call(this, 'example');

  // Set sample data so IFTTT can properly test this field.
  this.setOptionsSampleData('valid_option_value', 'invalid_option_value');
}
util.inherits(ExampleField, Ifttt.Trigger.TriggerField);

// Overwrite `_getOptionsData` to return field options.
ExampleField.prototype._getOptionsData = function(req, response, cb) {
  var option = new response.OptionEntity();
  option.setLabel('Valid option 1');
  option.setValue('valid_option_value');
  response.addOption(option);

  var option = new response.OptionEntity();
  option.setLabel('Valid option 2');
  option.setValue('valid_option_value2');
  response.addOption(option);

  return cb(null);
};

// Overwrite `_getValidateData` to check if value is valid.
ExampleField.prototype._getValidateData = function(req, response, payload, cb) {
  var value = payload.getValue();

  if (value === 'valid_option_value') {
    response.setValid(true);
    return cb(null);
  } else if (value === 'invalid_option_value') {
    response.setValid(false);
    return cb(null);
  }
};

module.exports = ExampleField;
