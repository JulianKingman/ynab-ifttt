var util = require('util');

var Field = require('./field');
var TriggerFieldValidatePayload = require('../payload/triggerFieldValidatePayload');
var ValidateResponse = require('../response/validateResponse');

/**
 * TriggerField
 *
 * @param slug
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#trigger-fields
 */
function TriggerField(slug) {
  TriggerField.super_.call(this, slug);

  // Default to required.
  this.fieldRequired = true;
}
util.inherits(TriggerField, Field);

TriggerField.prototype.validate = function(req, payload, cb) {
  var triggerFieldValidatePayload = new TriggerFieldValidatePayload(payload);
  var validateResponse = new ValidateResponse();

  this._getValidateData(req, validateResponse, triggerFieldValidatePayload, function(err){
    if (err) {
      return cb(err);
    }

    return cb(null, validateResponse.getData());
  });
};

TriggerField.prototype._getValidateData = function(req, response, payload, cb) {
  return cb(new Error('No validate handler defined.'));
};

module.exports = TriggerField;
