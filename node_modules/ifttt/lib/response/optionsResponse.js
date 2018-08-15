var util = require('util');

var OptionEntity = require('./entity/optionEntity');
var Response = require('./response');

/**
 * OptionsResponse
 *
 * @constructor
 */
function OptionsResponse() {
  OptionsResponse.super_.call(this);

  // Make sure data is an array.
  this.data = [];
}
util.inherits(OptionsResponse, Response);

OptionsResponse.prototype.addOption = function(option) {
  if (!(option instanceof OptionEntity)) {
    throw new Error('Data needs to be of type OptionsResponse.');
  }

  this.data.push(option);
};

OptionsResponse.prototype.getData = function() {
  var response = [];

  this.data.forEach(function(option){
    response.push(option.getData());
  });

  return response;
};

OptionsResponse.OptionEntity = OptionEntity;
OptionsResponse.prototype.OptionEntity = OptionEntity;

module.exports = OptionsResponse;
