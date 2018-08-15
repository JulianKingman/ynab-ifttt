var util = require('util');

var Payload = require('./payload');

/**
 * TriggerFieldValidatePayload
 *
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#trigger-field-dynamic-validation
 */
function TriggerFieldValidatePayload(payload) {
  TriggerFieldValidatePayload.super_.call(this, payload);
}
util.inherits(TriggerFieldValidatePayload, Payload);

TriggerFieldValidatePayload.prototype.getValue = function() {
  return this.payload.value;
};

module.exports = TriggerFieldValidatePayload;
