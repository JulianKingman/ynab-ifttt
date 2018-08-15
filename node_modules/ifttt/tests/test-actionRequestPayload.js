var assert = require('assert');

var ActionRequestPayload = require('../lib/payload/actionRequestPayload');
var RequestPayload = require('../lib/payload/requestPayload');

describe('ActionRequestPayload', function() {
  it('inherits from RequestPayload', function(done) {
    var actionRequestPayload = new ActionRequestPayload();
    assert.ok(actionRequestPayload instanceof RequestPayload);
    done();
  });

  it('getFields', function(done) {
    var payload = {
      actionFields: {
        title: 'New Banksy photo!',
        body: 'Check out a new Bansky photo: http://example.com/images/125'
      }
    };
    var actionRequestPayload = new ActionRequestPayload(payload);

    assert.deepEqual(actionRequestPayload.getFields(), payload.actionFields);

    done();
  });

  it('getField', function(done) {
    var payload = {
      actionFields: {
        title: 'New Banksy photo!',
        body: 'Check out a new Bansky photo: http://example.com/images/125'
      }
    };
    var actionRequestPayload = new ActionRequestPayload(payload);

    assert.deepEqual(actionRequestPayload.getField('title'), payload.actionFields.title);
    assert.deepEqual(actionRequestPayload.getField('body'), payload.actionFields.body);

    done();
  });
});
