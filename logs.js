const chalk = require('chalk');

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

function logComponentName(component_name) {
  logPrefixed(chalk.gray('Component Name: <', chalk.green(component_name), '/>'));
}
/* 

*/
const logs = {
  logTitle,
  logComponentName,
};

module.exports = logs;
