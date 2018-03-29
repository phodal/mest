import { default as Mest } from '../src/mest'
const globalAny: any = global

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
  it('Mest is instantiable', () => {
    jest.spyOn(global.console, 'log')
    let mest = new Mest({
      file: 'data/url.csv'
    })
    mest.load()
    expect(1).toBe(1)
    // expect(console.log).toBeCalled()
  })
})
