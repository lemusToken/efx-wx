import Base from './base'

export default class WxGlobal extends Base {
  constructor () {
    super()
    this.engine = this.isWxMini() ? getApp().globalData : false
  }

  check () {
    return this.isWxMini()
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