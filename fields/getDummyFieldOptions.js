var ynabApi = require('../ynabApi');

const getDummyFieldOptions = async (req, response, cb) => {
  [{ id: 1, name: 1, id: 2, name: 2, id: 3, name: 3 }].forEach(payee => {
    const option = new response.OptionEntity();
    option.setLabel(payee.name);
    option.setValue(payee.id);
    response.addOption(option);
  });
  cb(null);
};

module.exports = getDummyFieldOptions;
