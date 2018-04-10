import { default as Mest } from '../src/mest'
import { IDiff } from '../src/model/IDiff'

describe('Mest Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Mest is instantiable', () => {
    expect(
      new Mest({
        file: 'data/url.csv'
      })
    ).toBeInstanceOf(Mest)
  })
})

describe('load file test', () => {
  it('error file path', () => {
    jest.spyOn(global.console, 'log')
    let mest = new Mest({
      file: 'data/s4e6d57rtfyguhijo.csv'
    })
    expect(() => {
      mest.load()
    }).toThrowError()
  })

  it('error file', () => {
    jest.spyOn(global.console, 'log')
    let mest = new Mest({
      file: 'data/error_csv_file.txt'
    })
    expect(() => {
      mest.load()
    }).toThrowError()
  })

  it('correct response', () => {
    jest.spyOn(global.console, 'log')
    let mest = new Mest({
      file: 'data/url.csv'
    })
    mest.load()
    expect(1).toBe(1)
  })
})

describe('local compare test', () => {
  it('basic compare', () => {
    jest.spyOn(global.console, 'log')
    let mest = new Mest()

    let results: IDiff = mest.localCompareInterface('mock/IError.ts', {
      id: 233333,
      key: 'ssfd',
      messages: '2010-11-08T11:46:51Z',
      documentation_url: 2
    })

    expect(results).toEqual({
      diff: {
        local: ['message'],
        remote: ['key', 'messages']
      },
      diffTypes: [
        {
          key: 'documentation_url',
          local: 'string',
          remote: 'number'
        }
      ],
      same: ['id', 'documentation_url']
    })
  })
})
