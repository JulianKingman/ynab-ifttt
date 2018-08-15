var util = require('util');

var Response = require('./response');

/**
 * ValidateResponse
 *
 * @constructor
 */
function ValidateResponse() {
  ValidateResponse.super_.call(this);

  // Make sure data is an object.
  this.data = {
    valid: true,
    message: ''
  };
}
util.inherits(ValidateResponse, Response);

ValidateResponse.prototype.setValid = function(valid) {
  this.data.valid = valid;
};

ValidateResponse.prototype.setMessage = function(message) {
  this.data.message = message;
};

ValidateResponse.prototype.getData = function() {
  var response = {
    valid: this.data.valid
  };

  if (!this.data.valid) {
    response.message = this.data.message;
  }

  return response;
};

module.exports = ValidateResponse;
