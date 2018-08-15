/**
 * Resource
 *
 * @param slug
 * @constructor
 */
function Resource(slug) {
  // The name of the trigger in URL.
  this.slug = slug;

  // Internal registry for triggerFields of this trigger.
  this.fieldRegistry = {};
}

Resource.prototype.getSlug = function() {
  return this.slug;
};

Resource.prototype.registerField = function(field) {
  this.fieldRegistry[field.getSlug()] = field;
};

Resource.prototype.getFields = function() {
  return this.fieldRegistry;
};

Resource.prototype.getField = function(slug) {
  return this.fieldRegistry[slug];
};

Resource.prototype.getResponse = function(req, requestPayload, cb) {
  this._getResponseData(req, requestPayload, cb);
};

Resource.prototype._getResponseData = function(req, requestPayload, cb) {
  return cb(new Error('No response handler defined.'));
};

module.exports = Resource;
