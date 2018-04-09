import { default as Mest } from '../src/mest'

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

    mest.localCompareInterface('mock/IUser.ts', {
      login: 'phodal',
      id: 472311,
      type: 'User',
      site_admin: false,
      name: 'Phodal Huang',
      company: '@ThoughtWorksInc',
      blog: 'https://www.phodal.com/',
      location: 'Shenzhen, China',
      email: null,
      hireable: true,
      bio: '待我代码编成，娶你为妻可好\r\n',
      public_repos: 254,
      public_gists: 12,
      followers: 11152,
      following: 15,
      created_at: '2010-11-08T11:46:51Z',
      updated_at: '2018-03-25T14:31:00Z'
    })
  })
})
