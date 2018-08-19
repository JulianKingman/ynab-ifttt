var ynabApi = require('../ynabApi');

const getCategoryFieldOptions = async (req, response, cb) => {
  var api = ynabApi(req);
  let categoryGroups = await api.categories.getCategories('last-used');
  categoryGroups = categoryGroups.data.category_groups;
  categoryGroups.forEach(group => {
    if (group.categories) {
      group.categories.forEach(category => {
        // console.log(category.id, `${group.name}/${category.name}`);
        const option = new response.OptionEntity();
        option.setLabel(`${group.name}/${category.name}`);
        option.setValue(category.id);
        response.addOption(option);
      });
    }
  });
  cb(null);
};

module.exports = getCategoryFieldOptions;
