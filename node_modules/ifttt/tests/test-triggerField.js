var assert = require('assert');

var Field = require('../lib/field/field');
var TriggerField = require('../lib/field/triggerField');
var TriggerFieldValidatePayload = require('../lib/payload/triggerFieldValidatePayload');
var ValidateResponse = require('../lib/response/validateResponse');

describe('TriggerField', function() {
  var triggerField = new TriggerField('example_trigger_field');

  it('inherits from Field', function(done) {
    assert.ok(triggerField instanceof Field);
    done();
  });

  it('validate returns an error', function(done) {
    triggerField.validate(null, {value: 'test'}, function(err, data){
      assert.ok(err);
      done();
    });
  });

  it('validate gets ValidateResponse and TriggerFieldValidatePayload as parameter', function(done) {
    triggerField._getValidateData = function(req, response, payload, cb){
      assert.ok(response instanceof ValidateResponse);
      assert.ok(payload instanceof TriggerFieldValidatePayload);
      assert.ok(!req);
      assert.equal(payload.getValue(), 'test');
      return cb();
    };

    triggerField.validate(null, {value: 'test'}, done);
  });
});
