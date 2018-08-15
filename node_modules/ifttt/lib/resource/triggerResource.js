var _ = require('underscore');
var util = require('util');

var TriggerField = require('../field/triggerField');
var TriggerRequestPayload = require('../payload/triggerRequestPayload');
var Resource = require('./resource');

/**
 * TriggerResource
 *
 * @param slug
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#triggers
 */
function TriggerResource(slug) {
  TriggerResource.super_.call(this, slug);
}
util.inherits(TriggerResource, Resource);

/**
 * Parse trigger specific payload.
 *
 * Payload:
 * triggerFields (object) Map of trigger field slugs to values.
 * limit (optional integer) Maximum number of items to be returned, default 50.
 * user (object) Information about the IFTTT user related to this request.
 */
TriggerResource.prototype.getResponse = function(req, payload, cb) {
  var triggerRequestPayload = new TriggerRequestPayload(payload);
  var fields = this.getFields();
  var payloadFields = triggerRequestPayload.getFields();
  var missingFields = [];
  var invalidFields = [];

  // Send error response if required actionFields property is missing.
  if (_.size(fields) && !triggerRequestPayload.hasProperty('triggerFields')) {
    var err = {
      statusCode: 400,
      message: 'Required properties missing: triggerFields'
    };
    return cb(err);
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
    var err = {
      statusCode: 400,
      message: 'Required fields missing: ' + missingFields.join(', ')
    };
    return cb(err);
  }

  // Send error response if fields have invalid values.
  if (invalidFields.length) {
    var err = {
      statusCode: 400,
      message: 'Required fields invalid: ' + invalidFields.join(', ')
    };
    return cb(err);
  }

  TriggerResource.super_.prototype.getResponse.call(this, req, triggerRequestPayload, function(err, data){
    if (err) {
      return cb(err);
    }

    // Sort results by timestamp (descending).
    data = _.sortBy(data, function(row){
      return row.meta.timestamp;
    }).reverse();

    // Limit results to requested maximum of items.
    data = _.first(data, triggerRequestPayload.getLimit());

    return cb(null, data);
  });
};

TriggerResource.TriggerField = TriggerField;

module.exports = TriggerResource;
