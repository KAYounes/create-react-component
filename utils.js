function getNameFromArray(component_name_array) {
  return component_name_array.map((s) => s.replace(/./, (s) => s.toUpperCase())).join('');
}

const utils = {
  getNameFromArray,
};

module.exports = utils;
