// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

// Create example field.
function CategoryField() {
  CategoryField.super_.call(this, 'category');

  this.fieldRequired = false;
  // Set sample data so IFTTT can properly test this field. For validation purposes.
  this.setOptionsSampleData('valid_option_value', 'invalid_option_value');
}
util.inherits(CategoryField, Ifttt.Trigger.TriggerField);

// Overwrite `_getOptionsData` to return field options.
CategoryField.prototype._getOptionsData = function(req, response, cb) {
  var api = ynabApi(req);

  api.categories.getCategories('last-used').then(data => {
    var option = new response.OptionEntity();
    var categories = data.data.categories;
    categories.forEach(category => {
      option.setLabel(category.name);
      option.setValue(category.id);
    });
    response.addOption(option);
    cb(null);
  });
};

// Overwrite `_getValidateData` to check if value is valid.
CategoryField.prototype._getValidateData = function(
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

module.exports = CategoryField;
