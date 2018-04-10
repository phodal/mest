import { IDiff } from './model/IDiff'

const fs = require('fs')
const Papa = require('papaparse')
const rp = require('request-promise')
const kindOf = require('kind-of')
const async = require('async')

import { resolve } from 'path'
import * as TJS from 'typescript-json-schema'
import { IMestOption } from './model/IMestOption'
import { IDiffType } from './model/IDiffType'

const colors = require('colors')
const basePath = process.cwd()

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

  constructor(options?: IMestOption) {
    if (options) {
      this.options = options
    }
  }

  load() {
    let filePath = process.cwd() + '/' + this.options.file

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
    const that = this

    async.map(jsonData, verifyContractCall)

    function verifyContractCall(arg: any, cb: any) {
      if (arg.url !== '') {
        const schema = that.getInterfaceScheme(arg.interface)

        rp(arg.url)
          .then(function(response: string) {
            let res = JSON.parse(response)
            if (schema && schema.properties) {
              console.log(`-> API ${arg.url} .`)

              that.compareInterface(res, schema)
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
  }

  localCompareInterface(interfaceName: any, apiResponse: any): any {
    const schema = this.getInterfaceScheme(interfaceName)

    if (schema && schema.properties) {
      return this.compareInterface(apiResponse, schema)
    }
  }

  private getInterfaceScheme(interfaceName: any) {
    let splitInterfaceUrl = interfaceName.split('/')
    let fileName = splitInterfaceUrl[splitInterfaceUrl.length - 1]
    let typeName = fileName.substr(0, fileName.length - '.ts'.length)

    const program = TJS.getProgramFromFiles([resolve(interfaceName)], compilerOptions, basePath)
    return TJS.generateSchema(program, typeName, settings)
  }

  private compareInterface(apiResponse: any, schema: any) {
    let diff: IDiff = {
      diff: {
        local: [],
        remote: []
      },
      same: [],
      diffTypes: []
    }
    let resKeys = Object.keys(apiResponse)
    let interfaceKeys = Object.keys(schema.properties)
    const presents = intersectionWith(resKeys, interfaceKeys, isEqual)
    const localDiff = differenceWith(interfaceKeys, resKeys, isEqual)
    const remoteDiff = differenceWith(resKeys, interfaceKeys, isEqual)

    if (localDiff.length > 0 || remoteDiff.length > 0) {
      diff.same = presents
      diff.diff.local = localDiff
      diff.diff.remote = remoteDiff
      console.log(`same key: ${colors.green(presents.toString())}`)

      let localColor = colors.red(localDiff.toString())
      let remoteColor = colors.red(remoteDiff.toString())
      console.log(`local diff key: ${localColor}, remote diff: ${remoteColor}`)
    }

    diff.diffTypes = this.diffValueType(apiResponse, schema.properties)

    return diff
  }

  private diffValueType(apiResponse: any, properties: any): IDiffType[] {
    let diffTypes: IDiffType[] = []
    let resKeys = Object.keys(apiResponse)
    for (let i = 0; i < resKeys.length; i++) {
      let key = resKeys[i]
      if (apiResponse[key] && properties[key]) {
        let typeOfApiResponse = kindOf(apiResponse[key])
        let typeOfInterface = properties[key].type
        if (typeOfApiResponse !== typeOfInterface) {
          console.log(
            `difference ${colors.red(
              key
            )} type -> api: ${typeOfApiResponse}, interface -> ${typeOfInterface}`
          )
          diffTypes.push({
            key: key,
            local: typeOfInterface,
            remote: typeOfApiResponse
          })
        }
      }
    }

    return diffTypes
  }
}
