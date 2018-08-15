var assert = require('assert');

var Payload = require('../lib/payload/payload');

describe('Payload', function() {
  it('stores payload internally', function(done) {
    var payloadData = {
      key: 'value'
    };
    var payload = new Payload(payloadData);

    assert.deepEqual(payload.payload, payloadData);

    done();
  });
});
