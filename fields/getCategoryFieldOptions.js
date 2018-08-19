var ynabApi = require('../ynabApi');

const getCategoryFieldOptions = async (req, response, cb) => {
  var api = ynabApi(req);
  let categoryGroups = await api.categories.getCategories('last-used');
  categoryGroups = categoryGroups.data.category_groups;
  const categories = categoryGroups.map(group => ({
    label: group.name,
    values: group.categories.map(category => ({
      name: category.name,
      value: category.id,
    })),
  }));
  console.log('categories', categories);
  categories.forEach(category => {
    const option = new response.OptionEntity();
    option.setLabel(category.label);
    option.setValue(category.values);
    response.addOption(option);
  });
  cb(null);
};

module.exports = getCategoryFieldOptions;
