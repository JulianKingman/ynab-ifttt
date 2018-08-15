var assert = require('assert');

var Payload = require('../lib/payload/payload');
var RequestPayload = require('../lib/payload/requestPayload');

describe('RequestPayload', function() {
  it('inherits from Payload', function(done) {
    var requestPayload = new RequestPayload();
    assert.ok(requestPayload instanceof Payload);
    done();
  });

  it('getUser', function(done) {
    var payload = {
      user: {
        timezone: 'Pacific Time (US & Canada)'
      }
    };
    var requestPayload = new RequestPayload(payload);

    assert.deepEqual(requestPayload.getUser(), payload.user);

    done();
  });
});
