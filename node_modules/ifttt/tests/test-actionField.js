var assert = require('assert');

var ActionField = require('../lib/field/actionField');
var Field = require('../lib/field/field');

describe('ActionField', function() {
  var actionField = new ActionField('example_action_field');

  it('inherits from Field', function(done) {
    assert.ok(actionField instanceof Field);
    done();
  });

  it('setRequired / isRequired', function(done) {
    assert.equal(actionField.isRequired(), false);
    actionField.setRequired(true);
    assert.equal(actionField.isRequired(), true);
    actionField.setRequired(false);
    assert.equal(actionField.isRequired(), false);
    done();
  });
});
