var assert = require('assert');

var Field = require('../lib/field/field');
var OptionsResponse = require('../lib/response/optionsResponse');

describe('Field', function() {
  var field = new Field('example_field');

  it('getSlug', function(done) {
    assert.equal(field.getSlug(), 'example_field');

    done();
  });

  it('options returns an error', function(done) {
    field.options(null, function(err, data){
      assert.ok(err);
      done();
    });
  });

  it('options gets OptionsResponse as parameter', function(done) {
    field._getOptionsData = function(req, response, cb){
      assert.ok(response instanceof OptionsResponse);
      assert.ok(!req);
      return cb();
    };

    field.options(null, done);
  });
});
