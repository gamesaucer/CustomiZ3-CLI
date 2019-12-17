exports.command = 'patch [args..]'
const { hint, help } = require('./func/help')
const { vals } = require('./func/val')
const { err, ok } = require('./func/err')
const fsNormal = require('fs')
const fs = fsNormal.promises
const CustomiZ3 = require('@gamesaucer/customiz3-core')

const cmd = {
  cmd: 'customiz3 patch',
  desc: 'Applies a patch to a source file and writes the result to a target file',
  args: {
    projectFile: 'Path to the project file to apply.',
    sourceFile: 'Path to the source file to patch.',
    targetFile: 'Path to the target file to write the patch to.'
  },
  flags: [
    { names: ['overwrite', 'o'], desc: 'Overwrite the target file if it exists.', default: false },
    { names: ['type', 't'], desc: 'Which kind of patching process to apply.', default: 'native' },
    { names: ['help', 'h'], desc: 'Show documentation for commandline options.' }
  ]
}

exports.handler = async function (argv) {
  if (argv.help === true || argv.h === true) return help(cmd)
  if (argv.args === undefined || argv.args.length < Object.keys(cmd.args).length) return hint(cmd)

  const flags = vals(argv, cmd.flags)
  const args = argv.args
  var errorOccurred = false

  if (args[1] === args[2]) {
    errorOccurred = true
    err('ERROR', 'Target and source file are the same!\nSelect a different target or source file.')
  }

  if (fsNormal.existsSync(args[2]) && flags[0] !== true) {
    errorOccurred = true
    err('ERROR', 'Target file already exists.\nCall with -o flag to overwrite existing files.')
  }

  if (!fsNormal.existsSync(args[1])) {
    errorOccurred = true
    err('ERROR', 'Source file doesn\'t exist.\nMake sure its name has been spelled right!')
  }

  var changes
  try {
    changes = JSON.parse(await fs.readFile(args[0]))
  } catch (error) {
    errorOccurred = true
    switch (error.name) {
      case 'SyntaxError':
        err('ERROR', 'Project file is not valid JSON.\nMake sure its name has been spelled right!')
        break
      case 'Error':
        err('ERROR', 'Project file doesn\'t exist.\nMake sure its name has been spelled right!')
        break
      default:
        throw error
    }
  }

  if (errorOccurred) return
  ok('OK', 'Files are OK.\nReady to start patching.')

  var version
  try {
    version = await CustomiZ3.getRomVersion(args[1])
  } catch (error) {
    return err('ERROR', 'Rom version is not supported.\nAborting patch.')
  }

  var domainList
  try {
    domainList = await CustomiZ3.getDomainList(changes)
  } catch (error) {
    return err('ERROR', 'Changes are not supported.\nAborting patch.')
  }

  var patcherFactory
  try {
    patcherFactory = await CustomiZ3.getPatcher(domainList, version)
  } catch (error) {
    err('ERROR', 'Patching failed with an unexpected error.\nAborting patch.')
    throw error
  }

  var patcher
  try {
    patcher = await patcherFactory(flags[1])
  } catch (error) {
    return err('ERROR', 'Patcher type is not supported.\nAborting patch.')
  }

  await patcher.patch(args[1], args[2])

  return ok('DONE', `Patch written to "${args[2]}".`)
}
