var util = require('util');

var Field = require('./field');

/**
 * ActionField
 *
 * @param slug
 * @constructor
 * @see https://developers.ifttt.com/docs/api_reference#action-fields
 */
function ActionField(slug) {
  ActionField.super_.call(this, slug);
}
util.inherits(ActionField, Field);

ActionField.prototype.setRequired = function(required) {
  this.fieldRequired = required;
};

module.exports = ActionField;
