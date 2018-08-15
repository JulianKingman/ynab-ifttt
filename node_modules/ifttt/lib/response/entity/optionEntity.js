/**
 * OptionEntity
 *
 * @constructor
 */
function OptionEntity() {
  this.label = null;
  this.value = null;
  this.values = [];
}

OptionEntity.prototype.setLabel = function(label) {
  this.label = label;
};

OptionEntity.prototype.setValue = function(value) {
  this.value = value;
};

OptionEntity.prototype.addOption = function(option) {
  this.values.push(option);
};

OptionEntity.prototype.getData = function() {
  var result = {
    label: this.label
  };

  if (this.values.length) {
    result.values = [];

    this.values.forEach(function(option){
      result.values.push(option.getData());
    });
  }
  else {
    result.value = this.value;
  }

  return result;
};

module.exports = OptionEntity;
