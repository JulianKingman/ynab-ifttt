/**
 * Response
 *
 * @constructor
 */
function Response() {
  // Internal store of the response data.
  this.data = null;

  // Internal store of the response errors.
  this.errors = [];
}

Response.prototype.hasData = function() {
  return !!this.data;
};

Response.prototype.setData = function(data) {
  this.data = data;
};

Response.prototype.getData = function() {
  return this.data;
};

Response.prototype.hasErrors = function() {
  return !!this.errors.length;
};

Response.prototype.addError = function(error) {
  this.errors.push(error);
};

Response.prototype.getErrors = function() {
  return this.errors;
};

Response.prototype.getResponse = function() {
  var response = {};

  if (this.hasErrors()) {
    response.errors = this.getErrors();
  }
  else {
    response.data = this.getData();
  }

  return response;
};

module.exports = Response;
