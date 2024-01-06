const path = require('path');
const fs = require('fs');

const PROJECT_PATH = process.cwd();
const SRC_PATH = path.join(PROJECT_PATH, 'src');
const COMPONENTS_PATH = path.join(SRC_PATH, 'components');
const constants = { PROJECT_PATH, SRC_PATH, COMPONENTS_PATH };

module.exports = constants;
