var Ifttt = require('ifttt');
var util = require('util');
const getAccountFieldOptions = require('./getAccountFieldOptions');
const getPayeeFieldOptions = require('./getPayeeFieldOptions');
const getCategoryFieldOptions = require('./getCategoryFieldOptions');

const optionMap = {
  category: getCategoryFieldOptions,
  account: getAccountFieldOptions,
  payee: getPayeeFieldOptions,
};

const getField = ({ type, slug }) => {
  const getFieldOptions = optionMap[slug];
  function Field() {
    Field.super_.call(this, slug);

    this.fieldRequired = false;
    // Set sample data so IFTTT can properly test this field. For validation purposes.
    this.setOptionsSampleData('valid_option_value', 'invalid_option_value');
  }
  util.inherits(
    Field,
    type === 'trigger' ? Ifttt.Trigger.TriggerField : Ifttt.Action.ActionField
  );

  Field.prototype._getOptionsData = getFieldOptions;

  // Overwrite `_getValidateData` to check if value is valid.
  Field.prototype._getValidateData = function(req, response, payload, cb) {
    var value = payload.getValue();

    if (value === 'valid_option_value') {
      response.setValid(true);
      return cb(null);
    } else if (value === 'invalid_option_value') {
      response.setValid(false);
      return cb(null);
    }
  };
  return Field;
};

module.exports = getField;
