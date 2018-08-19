var Ifttt = require('ifttt');
var util = require('util');
const getAccountFieldOptions = require('./getAccountFieldOptions');
const getPayeeFieldOptions = require('./getPayeeFieldOptions');
const getCategoryFieldOptions = require('./getCategoryFieldOptions');

const optionMap = {
  category: { getData: getCategoryFieldOptions, validSample: 'none' , invalidSample: 'invalid_value'},
  account: { getData: getAccountFieldOptions, validSample: 'none' , invalidSample: 'invalid_value'},
  payee: { getData: getPayeeFieldOptions, validSample: 'none' , invalidSample: 'invalid_value'},
  amount: { getData: undefined, validSample: 0 , invalidSample: 'invalid_value'},
  transaction_id: { getData: undefined, validSample: 'asdf' , invalidSample: 'invalid_value'},
  flag_color: { getData: undefined, validSample: 'none' , invalidSample: 'invalid_value'},
  amount_remaining: { getData: undefined, validSample: 20 , invalidSample: 'invalid_value'},
  percent_used: { getData: undefined, validSample: 50 , invalidSample: 'invalid_value'},
  days_before: { getData: undefined, validSample: 3 , invalidSample: 'invalid_value'},
  minimum_inflow: { getData: undefined, validSample: 0 , invalidSample: 'invalid_value'},
  minimum_outflow: { getData: undefined, validSample: 0 , invalidSample: 'invalid_value'},
  maximum_value: { getData: undefined, validSample: 2000 , invalidSample: 'invalid_value'},
  minimum_value: { getData: undefined, validSample: 0 , invalidSample: 'invalid_value'},
  cleared: { getData: undefined, validSample: 'cleared', invalidSample: 'invalid_value'},
};

const getField = ({ type, slug }) => {
  function Field() {
    Field.super_.call(this, slug);

    this.fieldRequired = false;
    // Set sample data so IFTTT can properly test this field. For validation purposes.
    this.setOptionsSampleData(optionMap[slug].validSample, optionMap[slug].invalidSample);
  }
  util.inherits(
    Field,
    type === 'trigger' ? Ifttt.Trigger.TriggerField : Ifttt.Action.ActionField
  );

  Field.prototype._getOptionsData = optionMap[slug].getData;

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
