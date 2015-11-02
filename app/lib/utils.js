var nconf = require('nconf');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function loadAPIKey() {
  nconf.file({
    file: getUserHome() + '/.codeship_apikey.json',
  });
  nconf.load();
  return nconf.get('api-key');
}

function setAPIKey(key) {
  nconf.set('api-key', key);
  nconf.save();
}

module.exports.getUserHome = getUserHome;
module.exports.loadAPIKey = loadAPIKey;
module.exports.setAPIKey = setAPIKey;
