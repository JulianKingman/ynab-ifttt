var assert = require('assert');

var ValidateResponse = require('../lib/response/validateResponse');
var Response = require('../lib/response/response');

describe('ValidateResponse', function() {
  var validateResponse = new ValidateResponse();

  it('inherits from Response', function(done) {
    assert.ok(validateResponse instanceof Response);
    done();
  });

  it('setValid / setMessage / getData', function(done) {
    assert.deepEqual(validateResponse.getData(), {valid: true});

    validateResponse.setValid(false);
    validateResponse.setMessage('test message');

    assert.deepEqual(validateResponse.getData(), {valid: false, message: 'test message'});

    done();
  });
});
