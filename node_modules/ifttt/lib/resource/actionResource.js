var _ = require('underscore');
var util = require('util');

var ActionField = require('../field/actionField');
var ActionRequestPayload = require('../payload/actionRequestPayload');
var Resource = require('./resource');

/**
 * ActionResource
 *
 * @param slug
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#actions
 */
function ActionResource(slug) {
  ActionResource.super_.call(this, slug);
}
util.inherits(ActionResource, Resource);

/**
 * Parse action specific payload.
 *
 * Payload:
 * actionFields (object) Map of action field slugs to values.
 * user (object) Information about the IFTTT user related to this request.
 */
ActionResource.prototype.getResponse = function(req, payload, cb) {
  var actionRequestPayload = new ActionRequestPayload(payload);
  var fields = this.getFields();
  var payloadFields = actionRequestPayload.getFields();
  var missingFields = [];
  var invalidFields = [];

  // Send error response if required actionFields property is missing.
  if (_.size(fields) && !actionRequestPayload.hasProperty('actionFields')) {
    var message = 'Required properties missing: actionFields';
    return this.generateErrorResponse(message, false, cb);
  }

  _.each(fields, function(field){
    var field_slug = field.getSlug();

    if (field.isRequired()) {
      // Check missing fields.
      if (!_.isObject(payloadFields) || !_.has(payloadFields, field_slug)) {
        missingFields.push(field_slug);
      }
      // Check invalid fields.
      else if (!payloadFields[field_slug].length) {
        invalidFields.push(field_slug);
      }
    }
  });

  // Send error response if required fields are missing.
  if (missingFields.length) {
    var message = 'Required fields missing: ' + missingFields.join(', ');
    return this.generateErrorResponse(message, false, cb);
  }

  // Send skip response if fields have invalid values.
  if (invalidFields.length) {
    var message = 'Required fields invalid: ' + invalidFields.join(', ');
    return this.generateErrorResponse(message, true, cb);
  }

  return ActionResource.super_.prototype.getResponse.call(this, req, actionRequestPayload, cb);
};

ActionResource.prototype.generateErrorResponse = function(message, skip, cb) {
  var err = {
    statusCode: 400,
    message: message
  };

  if (skip) {
    err.status = 'SKIP';
  }

  return cb(err);
};

ActionResource.ActionField = ActionField;

module.exports = ActionResource;
