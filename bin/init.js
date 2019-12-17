exports.command = 'init [args..]'
const { hint, help } = require('./func/help')
const { vals } = require('./func/val')
const { err, ok } = require('./func/err')
const fs = require('fs').promises

const cmd = {
  cmd: 'customiz3 init',
  desc: 'Create an empty project',
  args: {
    projectFile: 'Path to the project file to create.'
  },
  flags: [
    { names: ['overwrite', 'o'], desc: 'Overwrite the file if it exists.', default: false },
    { names: ['help', 'h'], desc: 'Show documentation for commandline options.' }
  ]
}

exports.handler = async function (argv) {
  if (argv.help === true || argv.h === true) return help(cmd)
  if (argv.args === undefined || argv.args.length < Object.keys(cmd.args).length) return hint(cmd)

  const flags = vals(argv, cmd.flags)
  const args = argv.args

  try {
    await fs.writeFile(args[0], '{}', { flag: flags[0] ? 'w' : 'wx' })
    return ok('DONE', `"${args[0]}" has been initialized.\nProvide it as an argument to the other commands to edit it.`)
  } catch (error) {
    return err('ERROR', 'File already exists.\nCall with -o flag to overwrite existing files.')
  }
}
