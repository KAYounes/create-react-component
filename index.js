#!/usr/bin/env node
const { program, Option } = require('commander');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const os = require('os');

const logs = require('./logs');
const utils = require('./utils');
const checks = require('./checks');
const path = require('path');
const chalk = require('chalk');
const { realpathSync } = require('fs');
const constants = require('./constants');

////////////////////////////////////////////////////
/* 
    Prompt
*/
program
  .argument('<name>', 'component name')
  .addOption(
    new Option(
      '-f --force',
      'Ignores checks and crerates the component in the current directory component/<component-name>',
    ),
  )
  .addOption(new Option('-c --client-comp', "Add 'use client' to component"))
  .addOption(new Option('--nocss', 'Dose not create a css module'))
  .addOption(new Option('-n, --css-name <name>').conflicts('nocss'))
  .addOption(new Option('-x, --as-jsx').default(false))
  .addOption(new Option('-e, -file-extention <name>').default('js').conflicts('jsx'));

program.parse();

const [...COMPONENT_NAME_ARRY] = program.args;
const { name: COMPONENT_NAME, changed } = utils.parseComponentName(COMPONENT_NAME_ARRY);

const OPTIONS = program.opts();

const {
  cssName: CSS_MODULE_NAME = COMPONENT_NAME,
  nocss: NO_CSS = false,
  clientComp: CLIENT_COMPONENT = false,
  force: FORCE = false,
  asJsx: AS_JSX = true,
  fileExtention: FILE_EXTENTION = 'js',
} = OPTIONS;
/* 

*/
logs.logLines(1);
logs.logTitle('Logs');
logs.logComponentName(COMPONENT_NAME);
if (changed) logs.logComponentNameChanged(utils.getNameFromArray(COMPONENT_NAME_ARRY), COMPONENT_NAME);

const inProject = checks.isInProject();

if (!inProject && !FORCE) {
  const reason =
    chalk.gray('Reason: ') +
    chalk.gray(
      "the 'src' directory, 'package.json', and/or 'package-lock.json' were not found in the current directory",
    );

  const fixs = [
    chalk.gray('Fix: ') + chalk.gray('Please make sure you are running this in the root of your react project'),
    chalk.gray('Fix: ') + chalk.gray("Make sure you have a 'src' directory."),
    chalk.gray('Fix: ') + chalk.gray("Use the '-f' option to force the script to continue"),
  ];

  cannotProceed(reason, fixs);
}

logs.logComponentPath(COMPONENT_NAME);

const component_already_exists = checks.checkForComponentNameDir(COMPONENT_NAME);

if (component_already_exists) {
  const component_path_abs = path.join(constants.COMPONENTS_PATH, COMPONENT_NAME);
  const component_path_relative = utils.makePathRelative(component_path_abs);
  const reason =
    chalk.gray('Reason: ') +
    chalk.gray('A directory for the component already exists at => ') +
    chalk.red.underline(component_path_relative);

  const fix =
    chalk.gray('Fix: ') +
    chalk.gray('Delete the directory at the path => ') +
    chalk.green.underline(component_path_relative);
  cannotProceed(reason, fix);
}

createComponent();
logs.logLines(2);
/*  */
function cannotProceed(reason, fix) {
  logs.logTermination(reason, fix);
  logs.logLines(3);

  process.exit(1);
}

function createComponent() {
  let css_name = COMPONENT_NAME;
  const component_file = `${COMPONENT_NAME}.${FILE_EXTENTION}${AS_JSX ? 'x' : ''}`;
  const component_path = path.join(constants.COMPONENTS_PATH, COMPONENT_NAME, component_file);

  try {
    const components_dir_exist = checks.checkForComponentsDir();

    if (!components_dir_exist) {
      const _path = path.join(constants.COMPONENTS_PATH, COMPONENT_NAME);
      fs.mkdirSync(_path, { recursive: true });
    }

    const template_path = path.join(__dirname, 'template.js');
    const template = fs.readFileSync(template_path, { encoding: 'utf-8' });

    const component = template.replaceAll('COMPONENT_NAME', COMPONENT_NAME);
    let lines = component.split(os.EOL);

    if (!NO_CSS) {
      createCss();
      const importCSSStatement = `import styles from './${css_name}.module.css';`;
      lines.splice(1, 0, importCSSStatement);
      logs.logCSSComplete(`${css_name}.module.css`);
    }

    if (CLIENT_COMPONENT) {
      lines.splice(0, 0, '"use client"');
      logs.logUseClientComplete();
    }

    fs.writeFileSync(component_path, lines.join(os.EOL), { encoding: 'utf-8' });

    const base = utils.truncatePath(constants.COMPONENTS_PATH);
    logs.logTree(base, component_file, `${css_name}.module.css`);
    logs.logSuccess();
  } catch (error) {
    cannotProceed(
      chalk.gray('reason: ', error),
      chalk.gray(
        'fix: unknow error, no fixes known. Make sure the component name is a valid file name on your machine.',
      ),
    );
    cleanUp(COMPONENT_NAME);
  }

  function createCss() {
    if (CSS_MODULE_NAME) {
      const sanitizedCSSName = sanitize(CSS_MODULE_NAME);
      if (sanitizedCSSName !== '') css_name = sanitizedCSSName;
    }

    css_name = css_name.replace(/^./, (s) => s.toLowerCase());

    const styles_path = path.join(constants.COMPONENTS_PATH, COMPONENT_NAME, `${css_name}.module.css`);
    fs.writeFileSync(styles_path, '');
    return css_name;
  }
}

function cleanUp(component_name) {
  const _path = path.join(constants.COMPONENTS_PATH, component_name);
  const fileExist = fs.existsSync(_path);
  if (fileExist) fs.rmdirSync(_path);
}
