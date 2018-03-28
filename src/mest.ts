const fs = require('fs')
const Papa = require('papaparse')

import { IMestOption } from './model/IMestOption'

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
        setImmediate(cb, null, arg)
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
