#! /usr/bin/env node
const { h, render } = require('ink');
const program = require('commander');
const pkg = require('../package.json');
const Comp = require('./Comp');

let unmount;

const onExit = error => {
  setTimeout(() => {
    unmount();
    process.exit(error);
  }, 0);
};

program
  .version(pkg.version, '-v, --version')
  .arguments('<package_name>')
  .usage('<package_name>')
  .action((package_name) => {
    unmount = render(h(Comp, { packageName: package_name, onExit }));
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
