var assert = require('assert');

var TriggerResource = require('../lib/resource/triggerResource');
var TriggerRequestPayload = require('../lib/payload/triggerRequestPayload');
var Resource = require('../lib/resource/resource');

describe('TriggerResource', function() {
  var triggerResource = new TriggerResource('example');

  it('inherits from Resource', function(done) {
    assert.ok(triggerResource instanceof Resource);
    done();
  });

  it('setResponseHandler / getResponse with TriggerRequestPayload', function(done) {
    triggerResource._getResponseData = function(req, requestPayload, cb){
      assert.ok(requestPayload instanceof TriggerRequestPayload);
      return cb();
    };

    triggerResource.getResponse(null, {}, done);
  });
});
