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
  it('Mest is instantiable', () => {
    let mest = new Mest({
      file: 'data/url.csv'
    })
    mest.load()
    expect(1).toBe(1)
  })
})
