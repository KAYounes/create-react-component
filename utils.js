const sanitize = require('sanitize-filename');
const path = require('path');
const constants = require('./constants');

function getNameFromArray(component_name_array) {
  return component_name_array.map((s) => s.replace(/./, (s) => s.toUpperCase())).join('');
}

function truncatePath(abs_path) {
  const depth = constants.PROJECT_PATH.split('\\').length - 1;
  return path.normalize(abs_path.split(path.sep).slice(depth).join(path.sep));
}

function makePathRelative(_path, truncate = true) {
  if (truncate) _path = truncatePath(_path);

  return '"' + path.normalize('...' + path.sep + _path) + '"';
}

function makeValidFileName(component_name) {
  return sanitize(component_name);
}

function parseComponentName(component_name_array) {
  const component_name = getNameFromArray(component_name_array);
  const sanitized = makeValidFileName(component_name);
  const changed = component_name !== sanitized;
  return { name: sanitized, changed: changed };
}
const utils = {
  getNameFromArray,
  truncatePath,
  makePathRelative,
  parseComponentName,
};

module.exports = utils;
