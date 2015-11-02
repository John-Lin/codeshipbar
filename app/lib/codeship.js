'use strict';
var CodeShip = require('node-codeship');
var utils = require('./utils.js');

function setCodeShipAPIKey() {
  return new CodeShip({
    apiKey: utils.loadAPIKey() || 'api-key',
  });
}

function getProjectList(callback) {
  let projectList = [];
  let projectObj = {};
  let cs = setCodeShipAPIKey();
  cs.projects((response) => {
    for (let p of response.projects) {
      projectObj.id = p.id;
      projectObj.repoName = p.repository_name;
      projectObj.repoProvider = p.repository_provider;

      projectList.push(JSON.parse(JSON.stringify(projectObj)));
    }

    callback(null, projectList);
  });

}

function getBuildHistory(id, callback) {
  let projectList = [];
  let cs = setCodeShipAPIKey();
  cs.project(id, (response) => {
    callback(null, response.builds);
  });

}

module.exports.getProjectList = getProjectList;
module.exports.getBuildHistory = getBuildHistory;
