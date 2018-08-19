// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

const getAccountFieldOptions = (_getOptionsData = function(req, response, cb) {
  var api = ynabApi(req);

  api.accounts.getAccounts('last-used').then(function(data) {
    var option = new response.OptionEntity();
    var accounts = data.data.accounts;
    accounts.forEach(function(account) {
      option.setLabel(account.name);
      option.setValue(account.id);
    });
    response.addOption(option);
    cb(null);
  });
});

module.exports = getAccountFieldOptions;
