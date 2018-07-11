import Base from './base'

export default class WinLocal extends Base {
  constructor () {
    super()
    this.engine = {}
  }

  check () {
    return true
  }

  setItem (key, val) {
    this.engine[key] = val
  }

  getItem (key) {
    return this.engine[key]
  }

  set (key, val) {
    this.setItem(key, val)
  }

  get (key) {
    return this.getItem(key)
  }

  remove (key) {
    this.engine[key] = null
  }
}