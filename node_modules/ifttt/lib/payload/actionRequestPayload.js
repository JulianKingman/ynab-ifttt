var _ = require('underscore');
var util = require('util');

var RequestPayload = require('./requestPayload');

/**
 * ActionRequestPayload
 *
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#actions
 */
function ActionRequestPayload(payload) {
  ActionRequestPayload.super_.call(this, payload);
}
util.inherits(ActionRequestPayload, RequestPayload);

ActionRequestPayload.prototype.getFields = function() {
  return this.payload.actionFields;
};

ActionRequestPayload.prototype.getField = function(field) {
  if (this.payload.actionFields && _.has(this.payload.actionFields, field)) {
    return this.payload.actionFields[field];
  }
  else {
    return null;
  }
};

module.exports = ActionRequestPayload;
