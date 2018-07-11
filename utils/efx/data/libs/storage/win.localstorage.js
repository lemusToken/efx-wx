import Base from './base'

export default class WinLocal extends Base {
  constructor () {
    super()
    this.engine = this.check() ? window.localStorage : false
  }

  check () {
    return this.isWindow() && !!window.localStorage
  }

  setItem(key, val) {
    this.engine.setItem(key, this.input(val))
  }

  getItem(key) {
    return this.output(this.engine.getItem(key))
  }

  set(key, val, timeout = 0) {
    if (timeout > 0) {
      this.setWithTime(key, timeout)
    }
    this.setItem(key, val)
  }

  get(key) {
    if (!this.getWithTime(key)) {
      return null
    }
    return this.getItem(key)
  }

  remove(key) {
    this.engine.removeItem(key)
  }
}