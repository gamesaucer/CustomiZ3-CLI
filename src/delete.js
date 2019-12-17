exports.command = 'delete [args..]'
const { hint, help } = require('./func/help')
const { vals } = require('./func/val')
const { err, ok } = require('./func/err')
const fs = require('fs')

const cmd = {
  cmd: 'customiz3 delete',
  desc: 'Deletes a project file',
  args: {
    projectFile: 'Path to the project file to delete.'
  },
  flags: [
    { names: ['force', 'f', 'yes', 'y'], desc: 'Delete the file for sure.', default: false },
    { names: ['help', 'h'], desc: 'Show documentation for commandline options.' }
  ]
}

exports.handler = function (argv) {
  if (argv.help === true || argv.h === true) return help(cmd)
  if (argv.args === undefined || argv.args.length < Object.keys(cmd.args).length) return hint(cmd)

  const flags = vals(argv, cmd.flags)
  const args = argv.args

  if (flags[0] !== true) {
    return err('ERROR',
      'Deletion must be forced to prevent accidents.\n' +
      'Deletion cannot be undone, so make sure you want to proceed.\n' +
      'Call again with --force flag to delete the file.')
  }

  try {
    fs.unlinkSync(args[0])
    return ok('DONE', `"${args[0]}" has been deleted forever.`)
  } catch (error) {
    err('ERROR', 'An unexpected error occurred deleting the project file.')
    throw error
  }
}
