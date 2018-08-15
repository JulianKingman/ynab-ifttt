var assert = require('assert');

var Response = require('../lib/response/response');

describe('Response', function() {
  var response = new Response();

  it('hasData / setData', function(done) {
    assert.ok(!response.hasData());

    response.setData('test');

    assert.ok(response.hasData());
    assert.equal(response.getData(), 'test');

    done();
  });

  it('hasErrors / addError / getErrors', function(done) {
    assert.ok(!response.hasErrors());

    response.addError('test');

    assert.ok(response.hasErrors());
    assert.deepEqual(response.getErrors(), ['test']);

    done();
  });

  it('getResponse - returns error', function(done) {
    var responseErr = new Response();
    responseErr.addError('test');

    var resp = responseErr.getResponse();

    assert.ok(resp.errors);
    assert.ok(!resp.data);
    assert.deepEqual(resp.errors, ['test']);

    done();
  });

  it('getResponse - returns data', function(done) {
    var responseData = new Response();
    responseData.setData('test');

    var resp = responseData.getResponse();

    assert.ok(!resp.errors);
    assert.ok(resp.data);
    assert.equal(resp.data, 'test');

    done();
  });
});
