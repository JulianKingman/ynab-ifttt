var assert = require('assert');

var OptionsResponse = require('../lib/response/optionsResponse');
var Response = require('../lib/response/response');

describe('OptionsResponse', function() {
  var optionsResponse = new OptionsResponse();

  it('inherits from Response', function(done) {
    assert.ok(optionsResponse instanceof Response);
    done();
  });

  it('addOption / getData', function(done) {
    assert.deepEqual(optionsResponse.getData(), []);

    var option = new OptionsResponse.OptionEntity();
    option.setLabel('test_label');
    option.setValue('test_value');

    optionsResponse.addOption(option);

    assert.deepEqual(optionsResponse.getData(), [{label: 'test_label', value: 'test_value'}]);

    done();
  });
});
