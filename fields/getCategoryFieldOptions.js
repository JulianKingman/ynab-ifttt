var ynabApi = require('../ynabApi');

const getCategoryFieldOptions = async (req, response, cb) => {
  var api = ynabApi(req);
  let categories = await api.categories.getCategories('last-used');
  console.log('categories', categories);
  categories = categories.data.categories;
  categories.forEach(category => {
    const option = new response.OptionEntity();
    option.setLabel(category.name);
    option.setValue(category.id);
    response.addOption(option);
  });
  cb(null);
};

module.exports = getCategoryFieldOptions;
