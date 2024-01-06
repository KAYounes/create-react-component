const chalk = require('chalk');

const constants = require('./constants');
const path = require('path');
const utils = require('./utils');

function logPrefixed(log, prefixColor = chalk.gray) {
  console.log(prefixColor('|'), log);
}
/* 

*/

function logTitle(log, color = chalk.gray) {
  const text_len = log.length;
  const sep_length = 60;
  const sep = '='.repeat(sep_length);
  const spaces = ' '.repeat((sep_length - text_len) / 2);

  if (typeof color === 'undefined') color = chalk.gray;
  console.log(color(`${sep}\n${spaces}${log}\n${sep}`));
}

function logComponentNameChanged(original, final) {
  logPrefixed(
    chalk.gray('Component name changed to a valid file name:', chalk.red(original), '=>', chalk.green(final)),
  );
}
function logComponentName(component_name) {
  logPrefixed(chalk.gray('Component Name: <', chalk.green(component_name), '/>'));
}

function logComponentPath(component_name) {
  const abs_path = path.join(constants.COMPONENTS_PATH, component_name);
  const relative_path = utils.truncatePath(abs_path);
  logPrefixed(chalk.gray('Component Path: ', chalk.green('...\\' + relative_path)));
}

function logTermination(reason, fix) {
  logLines();
  logTitle('Termenating', chalk.red);
  logPrefixed(reason);

  if (fix instanceof Array) fix.map((f) => logPrefixed(f));
  else logPrefixed(fix);

  console.log(chalk.gray('='.repeat(60)));
}

function logLines(lines = 1) {
  console.log('\n'.repeat(lines));
}

function logCSSComplete(css_module) {
  logPrefixed(chalk.gray('CSS Module:', chalk.green(css_module)));
}
function logUseClientComplete(css_module) {
  logPrefixed(chalk.gray('Add "use client":', chalk.green('done')));
}

function logSuccess() {
  logTitle('All Done', chalk.green);
}

function logTree(base, component, css) {
  // base = base.replace(constants.PROJECT_DIR, 'home');
  // let paths = [path.join(base, component), css ? path.join(base, css) : ''];
  // paths = paths.map((p) => p.replaceAll('\\', '/'));
  // let tree = prettyTree(paths);
  // tree = tree.replaceAll('home', constants.PROJECT_DIR);
  // tree = tree.replaceAll('/', path.sep);
  // console.log(chalk.gray(tree));
  // console.log(' ' + chalk.gray(base));
  // console.log(chalk.gray(' |-' + component));
  // console.log(chalk.gray(' |-' + css));

  const text_len = base.length;
  const sep_length = 60;
  const sep = '='.repeat(sep_length);
  const spaces = ' '.repeat((sep_length - text_len) / 2);

  const tree = spaces + base + '\n' + spaces + ' |-' + component + '\n' + spaces + ' |-' + css;
  if (typeof color === 'undefined') color = chalk.gray;
  console.log(color(`${sep}\n${tree}\n${sep}`));
}
/* 

*/
const logs = {
  logTitle,
  logComponentName,
  logTermination,
  logComponentPath,
  logLines,
  logComponentNameChanged,
  logUseClientComplete,
  logCSSComplete,
  logSuccess,
  logTree,
};

module.exports = logs;
