// Require the module in your code.
var Ifttt = require('ifttt');
var util = require('util');

var ynabApi = require('../ynabApi');

const getAccountFieldOptions = (_getOptionsData = function(req, response, cb) {
  var api = ynabApi(req);

  api.accounts.getAccounts('last-used').then(function(data) {
    let accounts = data.data.accounts.sort(
      (a1, a2) => (a1.name < a2.name ? -1 : a2.name < a1.name ? 1 : 0)
    );
    let falsey = new response.OptionEntity();
    falsey.setLabel('None');
    falsey.setValue('none');
    response.addOption(falsey);
    accounts.forEach(account => {
      // console.log('account', account);
      option = new response.OptionEntity();
      option.setLabel(account.name);
      option.setValue(account.id);
      response.addOption(option);
    });
    cb(null);
  });
});

module.exports = getAccountFieldOptions;
