var ynabApi = require('../ynabApi');

const getPayeeFieldOptions = async (req, response, cb) => {
  var api = ynabApi(req);

  let payees = await api.payees.getPayees('last-used');
  payees = payees.data.payees;
  payees = payees.filter(p => !p.deleted);
  // console.log('payees response', payees);
  payees.forEach(payee => {
    const option = new response.OptionEntity();
    option.setLabel(payee.name);
    option.setValue(payee.id);
    response.addOption(option);
  });
  cb(null);
};

module.exports = getPayeeFieldOptions;
