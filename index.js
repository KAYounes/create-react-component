#!/usr/bin/env node

const utils = require('./utils');

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
  .addOption(new Option('-n, --css-name <name>').conflicts('nocss'));

program.parse();

const [...COMPONENT_NAME_ARRY] = program.args;
const COMPONENT_NAME = utils.getNameFromArray(COMPONENT_NAME_ARRY);

const OPTIONS = program.opts;
const {
  cssName: CSS_MODULE_NAME = COMPONENT_NAME,
  nocss: NO_CSS = false,
  clientComp: CLIENT_COMPONENT = false,
  force: FORCE = false,
} = OPTIONS;
