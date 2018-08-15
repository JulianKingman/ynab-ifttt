var _ = require('underscore');

/**
 * Payload
 *
 * @constructor
 */
function Payload(payload) {
  // Reference to the original payload.
  this.payload = payload;
}

Payload.prototype.hasProperty = function(property) {
  return _.has(this.payload, property);
};

module.exports = Payload;
