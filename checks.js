const fs = require('fs');
const constants = require('./constants');
const path = require('path');

function isInProject() {
  return checkforSrcDir() && checkPackageFiles();
}

function checkforSrcDir() {
  return checkPathExists('src');
}

function checkPackageFiles() {
  return checkPathExists('package.json') && checkPathExists('package-lock.json');
}

function checkForComponentsDir() {
  return checkPathExists(constants.COMPONENTS_PATH);
}

function checkForComponentNameDir(component_name) {
  const relative_path = path.join('src', 'components', component_name);
  return checkPathExists(relative_path);
}

function checkPathExists(relative_path) {
  const abs_path = path.join(constants.PROJECT_PATH, relative_path);
  return fs.existsSync(abs_path);
}
/* 

*/

const checks = {
  isInProject,
  checkforSrcDir,
  checkPackageFiles,
  checkPathExists,
  checkForComponentsDir,
  checkForComponentNameDir,
};

module.exports = checks;
