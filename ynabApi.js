var ynab = require('ynab');

var ynabApi = function(request) {
  var accessToken = request.header('Authorization');
  accessToken = accessToken.replace(/.*\s/g, '');
  var ynabClassInstance = new ynab.API(accessToken);
  // console.log('ynabClass', ynabClassInstance._configuration);
  // ynabClassInstance.user = new ynab.UserApi(ynabClassInstance._configuration);
  return ynabClassInstance;
};

module.exports = ynabApi;
