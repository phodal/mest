export interface IDiff {
  diff: {
    local: string[]
    remote: string[]
  }
  same: string[]
  diffType: {
    local: string[]
    remote: string[]
  }
}
