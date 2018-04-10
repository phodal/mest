import { IDiffType } from './IDiffType'

export interface IDiff {
  diff: {
    local: string[]
    remote: string[]
  }
  same: string[]
  diffTypes: IDiffType[]
}
