var assert = require('assert');

var Payload = require('../lib/payload/payload');
var TriggerFieldValidatePayload = require('../lib/payload/triggerFieldValidatePayload');

describe('TriggerFieldValidatePayload', function() {
  it('inherits from Payload', function(done) {
    var triggerFieldValidatePayload = new TriggerFieldValidatePayload();
    assert.ok(triggerFieldValidatePayload instanceof Payload);
    done();
  });

  it('getValue', function(done) {
    var payload = {
      value: 'test'
    };
    var triggerFieldValidatePayload = new TriggerFieldValidatePayload(payload);

    assert.deepEqual(triggerFieldValidatePayload.getValue(), payload.value);

    done();
  });
});
