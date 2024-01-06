const path = require('path');
const fs = require('fs');

const PROJECT_PATH = process.cwd();
const SRC_PATH = path.join(PROJECT_PATH, 'src');
const COMPONENTS_PATH = path.join(SRC_PATH, 'components');
const PROJECT_DIR = PROJECT_PATH.split(path.sep).at(-1);
const constants = { PROJECT_PATH, SRC_PATH, COMPONENTS_PATH, PROJECT_DIR };

module.exports = constants;
