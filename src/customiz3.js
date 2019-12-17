#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

const { hint, help, version } = require('./func/help')

const cmd = {
  cmd: 'customiz3',
  desc: 'CLI for customizing the Zelda 3 rom',
  args: {
    command: '[ init | delete | set | edit | patch ]'
  },
  flags: [
    { names: ['version', 'v'], desc: 'Show the version of this application.' },
    { names: ['help', 'h'], desc: 'Show documentation for commandline options.' }
  ]
}

function commandHandler (argv) {
  if (argv.help === true || argv.h === true) return help(cmd)
  if (argv.version === true || argv.v === true) return version()
  return hint(cmd)
}

require('yargs')
  .command('*', '', {}, commandHandler)
  .commandDir('.')
  .help(false)
  .version(false)
  .argv
