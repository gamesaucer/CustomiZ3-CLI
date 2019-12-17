/* global describe, it, expect */

const { exec } = require('child_process')

const cb = (cb, _err, stdout) => {
  cb(stdout)
}

describe('The command customiz3', () => {
  describe('--help', () => {
    it('should return command usage information', async done => {
      exec('node ./bin/customiz3.js --help', cb.bind(this, stdout => {
        expect(stdout.trim()).toEqual(expect.stringMatching(/customiz3[\s]+<command>/))
        done()
      }))
    })
  })
  describe('--version', () => {
    it('should return the current version', async done => {
      exec('node ./bin/customiz3.js --version', cb.bind(this, stdout => {
        expect(stdout.trim()).toEqual(expect.stringContaining(process.env.npm_package_version))
        done()
      }))
    })
  })
})
