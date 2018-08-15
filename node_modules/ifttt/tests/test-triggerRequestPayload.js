var assert = require('assert');

var RequestPayload = require('../lib/payload/requestPayload');
var TriggerRequestPayload = require('../lib/payload/triggerRequestPayload');

describe('TriggerRequestPayload', function() {
  it('inherits from RequestPayload', function(done) {
    var triggerRequestPayload = new TriggerRequestPayload();
    assert.ok(triggerRequestPayload instanceof RequestPayload);
    done();
  });

  it('getFields', function(done) {
    var payload = {
      triggerFields: {
        album_name: 'Street Art',
        hashtag: 'banksy'
      }
    };
    var triggerRequestPayload = new TriggerRequestPayload(payload);

    assert.deepEqual(triggerRequestPayload.getFields(), payload.triggerFields);

    done();
  });

  it('getField', function(done) {
    var payload = {
      triggerFields: {
        album_name: 'Street Art',
        hashtag: 'banksy'
      }
    };
    var triggerRequestPayload = new TriggerRequestPayload(payload);

    assert.deepEqual(triggerRequestPayload.getField('album_name'), payload.triggerFields.album_name);
    assert.deepEqual(triggerRequestPayload.getField('hashtag'), payload.triggerFields.hashtag);

    done();
  });

  it('getLimit - value from payload', function(done) {
    var payload = {
      limit: 10
    };
    var triggerRequestPayload = new TriggerRequestPayload(payload);

    assert.deepEqual(triggerRequestPayload.getLimit(), payload.limit);

    done();
  });

  it('getLimit - default value (50)', function(done) {
    var payload = {};
    var triggerRequestPayload = new TriggerRequestPayload(payload);

    assert.deepEqual(triggerRequestPayload.getLimit(), 50);

    done();
  });
});
