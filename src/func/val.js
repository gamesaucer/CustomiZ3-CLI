#!/usr/bin/env node
function val (argv, array, defaultValue) {
  var val
  array.forEach(arg => {
    if (argv[arg] !== undefined) val = argv[arg]
  })
  if (val !== undefined) return val
  return defaultValue
}

function vals (argv, flags) {
  return flags.map(flag => {
    return val(argv, flag.names, flag.default)
  })
}

module.exports.vals = vals
module.exports.val = val
