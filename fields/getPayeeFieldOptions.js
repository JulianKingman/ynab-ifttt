var ynabApi = require('../ynabApi');

const getPayeeFieldOptions = async (req, response, cb) => {
  var api = ynabApi(req);

  let payees = await api.payees.getPayees('last-used');
  payees = payees.data.payees;
  payees = payees
    .filter(p => !p.deleted)
    .sort((p1, p2) => (p1.name < p2.name ? -1 : p2.name < p1.name ? 1 : 0));
  // console.log('payees response', payees);
  let falsey = new response.OptionEntity();
  falsey.setLabel('None');
  falsey.setValue('none');
  response.addOption(falsey);
  payees.forEach(payee => {
    const option = new response.OptionEntity();
    option.setLabel(payee.name);
    option.setValue(payee.id);
    response.addOption(option);
  });
  cb(null);
};

module.exports = getPayeeFieldOptions;
