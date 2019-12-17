exports.command = 'set [args..]'
const { hint, help } = require('./func/help')
const { err, ok } = require('./func/err')
const fs = require('fs').promises

const cmd = {
  cmd: 'customiz3 set',
  desc: 'Applies settings to a project',
  args: {
    projectFile: 'Path to the project file to modify.'
  },
  flags: [
    { names: ['(domain).(key)'], desc: 'Apply the setting to the project with a provided value' },
    { names: ['help', 'h'], desc: 'Show documentation for commandline options.' }
  ]
}

exports.handler = async function (argv) {
  if (argv.help === true || argv.h === true) return help(cmd)
  if (argv.args === undefined || argv.args.length < Object.keys(cmd.args).length) return hint(cmd)

  const args = argv.args

  var project
  try {
    project = JSON.parse(await fs.readFile(args[0]))
  } catch (error) {
    switch (error.name) {
      case 'SyntaxError':
        return err('ERROR', 'Project file is not valid JSON.\nMake sure its name has been spelled right!')
      case 'Error':
        return err('ERROR', 'Project file doesn\'t exist.\nMake sure its name has been spelled right!')
      default:
        throw error
    }
  }

  var changes = []
  for (const domain in argv) {
    if (domain === '_' || domain === '$0' || domain === 'args' || !(argv[domain] instanceof Object)) continue
    if (project[domain] === undefined) project[domain] = {}
    for (const key in argv[domain]) {
      project[domain][key] = argv[domain][key]
      changes.push(`${domain}.${key} -> ${argv[domain][key]}`)
    }
  }

  try {
    await fs.writeFile(args[0], JSON.stringify(project))
    return ok('DONE', 'The following properties have been set:\n' + changes.join('\n'))
  } catch (error) {
    err('ERROR', 'An unexpected error occurred writing to the project file.')
    throw error
  }
}
