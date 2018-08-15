var _ = require('underscore');
var assert = require('assert');

var Ifttt = require('../ifttt');

describe('Ifttt', function() {
  var ifttt = new Ifttt({channelKey: 'test'});

  describe('_handleResponse', function() {
    it('error response - with native error', function(done) {
      var errorMessage = 'Test error';
      var err = new Error(errorMessage);
      var data = null;

      var response = ifttt._handleResponse(err, data);

      assert.equal(response.status, 500);
      assert.deepEqual(response.body.errors, [{message: errorMessage}]);

      done();
    });

    it('error response - with string', function(done) {
      var err = 'Test error';
      var data = null;

      var response = ifttt._handleResponse(err, data);

      assert.equal(response.status, 500);
      assert.deepEqual(response.body.errors, [{message: err}]);

      done();
    });

    it('error response - with object and optional status', function(done) {
      var err = {
        message: 'my message',
        status: 'TEST'
      };
      var data = null;

      var response = ifttt._handleResponse(err, data);

      assert.equal(response.status, 500);
      assert.deepEqual(response.body.errors, [err]);

      done();
    });

    it('error response - with custom http status code', function(done) {
      var err = {
        message: 'my message',
        status: 'TEST',
        statusCode: 123
      };
      var data = null;

      var response = ifttt._handleResponse(err, data);

      assert.equal(response.status, err.statusCode);
      assert.deepEqual(response.body.errors, [{
        message: err.message,
        status: err.status
      }]);

      done();
    });

    it('data response', function(done) {
      var err = null;
      var data = {key: 'value'};

      var response = ifttt._handleResponse(err, data);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body.data, data);

      done();
    });
  });

  describe('registerTrigger / getTriggers / getTrigger', function() {
    it('add / get triggers', function(done) {
      var trigger1 = new Ifttt.Trigger('trigger1');
      var trigger2 = new Ifttt.Trigger('trigger2');

      ifttt.registerTrigger(trigger1);
      ifttt.registerTrigger(trigger2);

      var triggers = ifttt.getTriggers();

      assert.ok(_.has(triggers, 'trigger1'));
      assert.ok(_.has(triggers, 'trigger2'));
      assert.equal(_.keys(triggers).length, 2);

      var trigger = ifttt.getTrigger('trigger1');
      assert.equal(trigger.getSlug(), 'trigger1');

      done();
    });
  });

  describe('getTriggerResponse', function() {
    it('error reponse - unknown trigger', function(done) {
      ifttt.getTriggerResponse('unknown', null, {}, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'Unknown trigger.'}]);

        done();
      });
    });

    it('error reponse - no response handler', function(done) {
      var trigger = new Ifttt.Trigger('invalid');

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerResponse('invalid', null, {}, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'No response handler defined.'}]);

        done();
      });
    });

    it('data reponse', function(done) {
      var trigger = new Ifttt.Trigger('valid_response');
      trigger._getResponseData = function(req, payload, cb){
        var data = [{key: 'value', meta: {id: '1-2-3-4', timestamp: 1234567890}}];
        return cb(null, data);
      };

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerResponse('valid_response', null, {}, function(response){
        assert.equal(response.status, 200);
        assert.deepEqual(response.body.data, [{key: 'value', meta: {id: '1-2-3-4', timestamp: 1234567890}}]);

        done();
      });
    });
  });

  describe('getTriggerFieldOptionsResponse', function() {
    it('error reponse - unknown trigger', function(done) {
      ifttt.getTriggerFieldOptionsResponse('unknown', 'unknown', null, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'Unknown trigger.'}]);

        done();
      });
    });

    it('error reponse - unknown trigger field', function(done) {
      var trigger = new Ifttt.Trigger('valid');

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerFieldOptionsResponse('valid', 'unknown', null, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'Unknown trigger field.'}]);

        done();
      });
    });

    it('error reponse - no options handler', function(done) {
      var trigger = new Ifttt.Trigger('valid');
      var triggerField = new Ifttt.Trigger.TriggerField('invalid');

      trigger.registerField(triggerField);

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerFieldOptionsResponse('valid', 'invalid', null, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'No options handler defined.'}]);

        done();
      });
    });

    it('data reponse', function(done) {
      var trigger = new Ifttt.Trigger('valid');
      var triggerField = new Ifttt.Trigger.TriggerField('valid_options');
      triggerField._getOptionsData = function(user, response, cb){
        var option = new response.OptionEntity();
        option.setLabel('Label');
        option.setValue('Value');
        response.addOption(option);

        return cb(null);
      };

      trigger.registerField(triggerField);

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerFieldOptionsResponse('valid', 'valid_options', null, function(response){
        assert.equal(response.status, 200);
        assert.deepEqual(response.body.data, [{
          label: 'Label',
          value: 'Value'
        }]);

        done();
      });
    });
  });

  describe('getTriggerFieldValidateResponse', function() {
    it('error reponse - unknown trigger', function(done) {
      ifttt.getTriggerFieldValidateResponse('unknown', 'unknown', null, {}, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'Unknown trigger.'}]);

        done();
      });
    });

    it('error reponse - unknown trigger field', function(done) {
      var trigger = new Ifttt.Trigger('valid');

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerFieldValidateResponse('valid', 'unknown', null, {}, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'Unknown trigger field.'}]);

        done();
      });
    });

    it('error reponse - no validate handler', function(done) {
      var trigger = new Ifttt.Trigger('valid');
      var triggerField = new Ifttt.Trigger.TriggerField('invalid');

      trigger.registerField(triggerField);

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerFieldValidateResponse('valid', 'invalid', null, {}, function(response){
        assert.equal(response.status, 500);
        assert.deepEqual(response.body.errors, [{message: 'No validate handler defined.'}]);

        done();
      });
    });

    it('data reponse', function(done) {
      var trigger = new Ifttt.Trigger('valid');
      var triggerField = new Ifttt.Trigger.TriggerField('valid_validate');
      triggerField._getValidateData = function(user, response, payload, cb){
        assert.equal(payload.getValue(), 'test');

        var data = {
          valid: true
        };

        return cb(null, data);
      };

      trigger.registerField(triggerField);

      ifttt.registerTrigger(trigger);

      ifttt.getTriggerFieldValidateResponse('valid', 'valid_validate', null, {value: 'test'}, function(response){
        assert.equal(response.status, 200);
        assert.deepEqual(response.body.data, {
          valid: true
        });

        done();
      });
    });
  });

  describe('generateTestSetupSample', function() {
    it('generate sample data', function(done) {
      var trigger = new Ifttt.Trigger('test_trigger');

      var triggerField = new Ifttt.Trigger.TriggerField('test_field');
      triggerField.setOptionsSampleData('valid_sample', 'invalid_sample');
      trigger.registerField(triggerField);

      var triggerFieldNoInvalidSample = new Ifttt.Trigger.TriggerField('test_field_no_invalid_sample');
      triggerFieldNoInvalidSample.setOptionsSampleData('valid_sample_data');
      trigger.registerField(triggerFieldNoInvalidSample);

      ifttt.registerTrigger(trigger);

      ifttt.generateTestSetupSample(function(response){
        assert.ok(_.has(response, 'triggers'));
        assert.ok(_.isObject(response.triggers));
        assert.ok(_.has(response, 'triggerFieldValidations'));
        assert.ok(_.isObject(response.triggerFieldValidations));
        assert.ok(_.has(response, 'actions'));
        assert.ok(_.isObject(response.actions));
        assert.ok(_.has(response, 'actionRecordSkipping'));
        assert.ok(_.isObject(response.actionRecordSkipping));

        done();
      });
    });
  });
});
