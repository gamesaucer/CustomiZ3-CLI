#!/usr/bin/env node
const chalk = require('chalk')

function print (msg, desc, col) {
  desc = '\n' + desc
  desc = desc.replace(/\n/g, '\n    ')
  process.stdout.write(col(`\n    ${msg}:`))
  process.stdout.write(chalk.gray(desc) + '\n')
}

function err (err, desc) {
  print(err, desc, chalk.red)
}

function inf (err, desc) {
  print(err, desc, chalk.cyan)
}

function ok (err, desc) {
  print(err, desc, chalk.green)
}

module.exports.print = print
module.exports.err = err
module.exports.ok = ok
module.exports.inf = inf
