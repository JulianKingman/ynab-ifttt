var _ = require('underscore');
var assert = require('assert');

var Field = require('../lib/field/field');
var Resource = require('../lib/resource/resource');

describe('Resource', function() {
  var resource = new Resource('example');

  it('getSlug', function(done) {
    assert.equal(resource.getSlug(), 'example');

    done();
  });

  it('setResponseHandler / getResponse', function(done) {
    resource._getResponseData = function(req, requestPayload, cb){
      return cb();
    };

    resource.getResponse(null, {}, done);
  });

  it('registerField / getFields', function(done) {
    var field1 = new Field('field1');
    var field2 = new Field('field2');

    resource.registerField(field1);
    resource.registerField(field2);

    var fields = resource.getFields();

    assert.ok(_.has(fields, 'field1'));
    assert.ok(_.has(fields, 'field2'));
    assert.equal(_.keys(fields).length, 2);

    done();
  });
});
