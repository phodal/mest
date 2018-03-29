const fs = require('fs')
const Papa = require('papaparse')
const rp = require('request-promise')

import { resolve } from 'path'
import * as TJS from 'typescript-json-schema'
import { IMestOption } from './model/IMestOption'

const colors = require('colors')

const isEqual = require('lodash.isequal')
const intersectionWith = require('lodash.intersectionwith')
const differenceWith = require('lodash.differencewith')

const settings: TJS.PartialArgs = {
  required: true
}

const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
}

export default class Mest {
  private options: IMestOption

  constructor(options: IMestOption) {
    this.options = options
  }

  load() {
    let filePath = process.cwd() + '/' + this.options.file
    if (!fs.existsSync(filePath)) {
      throw new Error(`Config file ${filePath} not exist`)
    }

    let fileData
    try {
      fileData = fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      throw new Error(error)
    }

    let jsonData

    try {
      jsonData = Papa.parse(fileData, { header: true })
    } catch (error) {
      throw new Error(error)
    }

    this.verifyData(jsonData.data)
  }

  verifyData(jsonData: any) {
    const parallel = require('fastparallel')({
      released: completed,
      results: true
    })

    parallel(
      {}, // what will be this in the functions
      verifyContractCall, // functions to call
      jsonData, // the first argument of the functions
      done // the function to be called when the parallel ends
    )

    function verifyContractCall(arg: any, cb: any) {
      if (arg.url !== '') {
        let splitInterfaceUrl = arg.interface.split('/')
        let fileName = splitInterfaceUrl[splitInterfaceUrl.length - 1]
        let typeName = fileName.substr(0, fileName.length - '.ts'.length)

        const basePath = process.cwd()
        const program = TJS.getProgramFromFiles([resolve(arg.interface)], compilerOptions, basePath)
        const schema = TJS.generateSchema(program, typeName, settings)

        rp(arg.url)
          .then(function(response: string) {
            let res = JSON.parse(response)
            if (schema && schema.properties) {
              let resKeys = Object.keys(res)
              let interfaceKeys = Object.keys(schema.properties)
              const presents = intersectionWith(resKeys, interfaceKeys, isEqual)
              const dif = differenceWith(interfaceKeys, resKeys, isEqual)
              console.log(`API ${arg.url}.`)
              console.log(`same key: ${colors.green(presents.toString())}`)
              console.log(`diff key: ${colors.red(dif.toString())}`)
            } else {
              throw new Error(`type ${schema} error`)
            }
          })
          .catch(function(err: any) {
            throw new Error(`${arg.url} has error: ${err}`)
          })
          .finally(() => {
            setImmediate(cb, null, arg)
          })
      }
    }

    function done(err: any, results: any) {
      if (err) {
        throw new Error(err)
      }
      console.log('parallel completed, results:', results)
    }

    function completed() {
      console.log('parallel completed!')
    }
  }
}
