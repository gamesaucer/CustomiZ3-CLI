#!/usr/bin/env node
const chalk = require('chalk')

function hint (hint) {
  process.stdout.write(`\n    Command:\n      ${chalk.gray(hint.cmd)}\n        `)
  for (const arg in hint.args) {
    process.stdout.write(chalk.green(` <${arg}>`))
  }
  process.stdout.write('\n        ')
  for (const flag in hint.flags) {
    process.stdout.write(chalk.yellow(` [--${hint.flags[flag].names[0]}]`))
  }
  process.stdout.write('\n')
}

function help (help) {
  hint(help)
  process.stdout.write('\n    Arguments:')
  for (const arg in help.args) {
    process.stdout.write(chalk.green(`\n      ${arg}`))
    process.stdout.cursorTo(20)
    process.stdout.write(` ${help.args[arg]}`)
  }
  process.stdout.write('\n\n    Flags:')
  for (const flag in help.flags) {
    process.stdout.write('\n      ')
    const names = help.flags[flag].names
    for (const name in names) {
      const prefix = names[name].length === 1 ? '-' : '--'
      process.stdout.write(chalk.yellow(`${prefix + names[name]}`))
      if (Number(name) + 1 !== names.length) {
        process.stdout.write(', ')
        if (name % 2 !== 0) process.stdout.write('\n      ')
      }
    }
    process.stdout.write(`\n        ${help.flags[flag].desc}`)
    if (help.flags[flag].default !== undefined) {
      process.stdout.write('\n        Default: ')
      process.stdout.write(chalk.gray(help.flags[flag].default))
    }
    process.stdout.write('\n')
  }
}

function version () {
  process.stdout.write('\n    CustomiZ3 version: ' + chalk.gray(require('../../package.json').version) + '\n')
}

module.exports.hint = hint
module.exports.help = help
module.exports.version = version
