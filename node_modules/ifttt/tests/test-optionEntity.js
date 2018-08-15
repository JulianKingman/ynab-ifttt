var assert = require('assert');

var OptionEntity = require('../lib/response/entity/optionEntity');

describe('OptionEntity', function() {
  it('setLabel / setValue', function(done) {
    var optionEntity = new OptionEntity();
    optionEntity.setLabel('test_label');
    optionEntity.setValue('test_value');

    assert.deepEqual(optionEntity.getData(), {
      label: 'test_label',
      value: 'test_value'
    });

    done();
  });

  it('nested options', function(done) {
    var optionEntity = new OptionEntity();
    optionEntity.setLabel('test_label');

    var optionEntitySub1 = new OptionEntity();
    optionEntitySub1.setLabel('test_sub1_label');
    optionEntitySub1.setValue('test_sub1_value');
    optionEntity.addOption(optionEntitySub1);

    var optionEntitySub2 = new OptionEntity();
    optionEntitySub2.setLabel('test_sub2_label');
    optionEntitySub2.setValue('test_sub2_value');
    optionEntity.addOption(optionEntitySub2);

    assert.deepEqual(optionEntity.getData(), {
      label: 'test_label',
      values: [
        {
          label: 'test_sub1_label',
          value: 'test_sub1_value'
        },
        {
          label: 'test_sub2_label',
          value: 'test_sub2_value'
        }
      ]
    });

    done();
  });
});
