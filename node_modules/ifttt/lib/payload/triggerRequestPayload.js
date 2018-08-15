var _ = require('underscore');
var util = require('util');

var RequestPayload = require('./requestPayload');

/**
 * TriggerRequestPayload
 *
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#triggers
 */
function TriggerRequestPayload(payload) {
  TriggerRequestPayload.super_.call(this, payload);

  this.payload = _.defaults(this.payload || {}, {
    limit: 50
  });
}
util.inherits(TriggerRequestPayload, RequestPayload);

TriggerRequestPayload.prototype.getFields = function() {
  return this.payload.triggerFields;
};

TriggerRequestPayload.prototype.getField = function(field) {
  if (this.payload.triggerFields && _.has(this.payload.triggerFields, field)) {
    return this.payload.triggerFields[field];
  }
  else {
    return null;
  }
};

TriggerRequestPayload.prototype.getLimit = function() {
  return this.payload.limit;
};

module.exports = TriggerRequestPayload;
