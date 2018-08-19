var ynabApi = require('../ynabApi');

const getCategoryFieldOptions = async (req, response, cb) => {
  var api = ynabApi(req);
  let categoryGroups = await api.categories.getCategories('last-used');
  categoryGroups = categoryGroups.data.category_groups.sort(
    (g1, g2) => (g1.name < g2.name ? -1 : g2.name < g1.name ? 1 : 0)
  );
  let falsey = new response.OptionEntity();
  falsey.setLabel('None');
  falsey.setValue('none');
  response.addOption(falsey);
  categoryGroups.forEach(group => {
    if (group.categories) {
      let categories = group.categories.sort(
        (g1, g2) => (g1.name < g2.name ? -1 : g2.name < g1.name ? 1 : 0)
      );
      categories.forEach(category => {
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
