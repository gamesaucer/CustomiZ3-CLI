exports.command = 'edit [args..]'
const { hint, help } = require('./func/help')
const { err, ok } = require('./func/err')
const fs = require('fs').promises
const readline = require('readline')

const cmd = {
  cmd: 'customiz3 edit',
  desc: 'Lets you directly edit settings in a project',
  args: {
    projectFile: 'Path to the project file to modify.'
  },
  flags: [
    { names: ['help', 'h'], desc: 'Show documentation for commandline options.' }
  ]
}

exports.handler = async function (argv) {
  if (argv.help === true || argv.h === true) return help(cmd)
  if (argv.args === undefined || argv.args.length < Object.keys(cmd.args).length) return hint(cmd)

  const args = argv.args
  var changes = []
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

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  askForKey()

  function askForKey (again = false) {
    rl.question('Choose which (domain).(key) to set ' + (again ? 'next > ' : '> '), (answer) => {
      askForValue(...answer.split('.'))
    })
  }

  function askForValue (domain, key) {
    rl.question('Choose the value > ', (answer) => {
      if (project[domain] === undefined) project[domain] = {}
      project[domain][key] = answer
      changes.push(`${domain}.${key} -> ${answer}`)
      askForKey(true)
    })
  }

  rl.on('SIGINT', async () => {
    process.stdout.write('\n')
    try {
      await fs.writeFile(args[0], JSON.stringify(project))
      rl.close()
      return ok('DONE', 'The following properties have been set:\n' + changes.join('\n'))
    } catch (error) {
      rl.close()
      err('ERROR', 'An unexpected error occurred writing to the project file.')
      throw error
    }
  })
}
