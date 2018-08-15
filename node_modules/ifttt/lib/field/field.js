var OptionsResponse = require('../response/optionsResponse');

/**
 * Field
 *
 * @param slug
 * @constructor
 */
function Field(slug) {
  // The name of the trigger_field in URL.
  this.slug = slug;

  // Reference to the sample data.
  this.samples = {
    options: {}
  };

  // Default to not required.
  this.fieldRequired = false;
}

Field.prototype.getSlug = function() {
  return this.slug;
};

Field.prototype.setOptionsSampleData = function(valid, invalid) {
  this.samples.options = {
    valid: valid,
    invalid: invalid
  };
};

Field.prototype.getOptionsSampleData = function() {
  return this.samples.options;
};

Field.prototype.options = function(req, cb) {
  var optionsResponse = new OptionsResponse();

  this._getOptionsData(req, optionsResponse, function(err){
    if (err) {
      return cb(err);
    }

    return cb(null, optionsResponse.getData());
  });
};

Field.prototype._getOptionsData = function(req, response, cb) {
  return cb(new Error('No options handler defined.'));
};

Field.prototype.isRequired = function() {
  return this.fieldRequired;
};

module.exports = Field;
