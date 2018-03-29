#!/usr/bin/env node

import { default as Mest } from './mest'

const colors = require('colors')
const program = require('commander')

const version = require('../../package.json').version

function testSchema(inputFile: string) {
  let mest = new Mest({
    file: inputFile
  })
  mest.load()
}

program
  .version(version)
  .option('-i, inputFile <inputFile>', 'Compare API', testSchema)
  .parse(process.argv)

if (!process.argv.slice(2).length || !process.argv.length) {
  program.outputHelp(colors.green)
}
