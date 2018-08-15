var assert = require('assert');

var ActionResource = require('../lib/resource/actionResource');
var ActionRequestPayload = require('../lib/payload/actionRequestPayload');
var Resource = require('../lib/resource/resource');

describe('ActionResource', function() {
  var actionResource = new ActionResource('example');

  it('inherits from Resource', function(done) {
    assert.ok(actionResource instanceof Resource);
    done();
  });

  it('setResponseHandler / getResponse with ActionRequestPayload', function(done) {
    actionResource._getResponseData = function(req, requestPayload, cb){
      assert.ok(requestPayload instanceof ActionRequestPayload);
      return cb();
    };

    actionResource.getResponse(null, {}, done);
  });

  it('generateErrorResponse - without status', function(done) {
    var actionResource = new ActionResource('skip');
    var message = 'my message';

    actionResource.generateErrorResponse(message, false, function(err, data){
      assert.deepEqual(err, {
        statusCode: 400,
        message: message
      });

      done();
    });
  });

  it('generateErrorResponse - with status', function(done) {
    var actionResource = new ActionResource('skip');
    var message = 'my message';

    actionResource.generateErrorResponse(message, true, function(err, data){
      assert.deepEqual(err, {
        statusCode: 400,
        status: 'SKIP',
        message: message
      });

      done();
    });
  });

  it('getResponse with missing actionFields error response', function(done) {
    var actionField = new ActionResource.ActionField('example_action_field');
    actionField.setRequired(true);

    actionResource.registerField(actionField);

    actionResource._getResponseData = function(req, requestPayload, cb){
      return cb();
    };

    actionResource.getResponse(null, {}, function(err, data){
      assert.ok(err);
      assert.equal(err.message, 'Required properties missing: actionFields');
      done();
    });
  });

  it('getResponse with missing fields error response', function(done) {
    var actionField = new ActionResource.ActionField('example_action_field');
    actionField.setRequired(true);

    actionResource.registerField(actionField);

    actionResource._getResponseData = function(req, requestPayload, cb){
      return cb();
    };

    actionResource.getResponse(null, {actionFields: {}}, function(err, data){
      assert.ok(err);
      assert.equal(err.message, 'Required fields missing: example_action_field');
      done();
    });
  });

  it('getResponse with invalid fields skip response', function(done) {
    var actionField = new ActionResource.ActionField('example_action_field');
    actionField.setRequired(true);

    actionResource.registerField(actionField);

    actionResource._getResponseData = function(req, requestPayload, cb){
      return cb();
    };

    actionResource.getResponse(null, {actionFields: {example_action_field: ''}}, function(err, data){
      assert.ok(err);
      assert.equal(err.status, 'SKIP');
      assert.equal(err.message, 'Required fields invalid: example_action_field');
      done();
    });
  });
});
