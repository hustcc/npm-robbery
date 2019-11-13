#! /usr/bin/env node
const { h, render } = require('ink');
const program = require('commander');
const p = require('../package.json');
const Comp = require('./Comp');
const ver = require('./ver');

let unmount;

const onExit = error => {
  setTimeout(() => {
    unmount();
    process.exit(error);
  }, 0);
};

program
  .version(p.version, '-v, --version')
  .arguments('<pkg>')
  .usage('<pkg>[@ver]')
  .action(pkg => {
    const [ packageName, version ] = ver.parsePkgVer(pkg);
    unmount = render(h(Comp, { packageName, version, onExit }));
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
