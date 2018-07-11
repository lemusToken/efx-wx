import Base from './base'

export default class WxLocal extends Base {
  constructor () {
    super()
    const isWx = this.check()
    this.engineSet = isWx ? wx.setStorageSync : false
    this.engineGet = isWx ? wx.getStorageSync : false
  }

  check () {
    return this.isWxMini()
  }

  setItem (key, val) {
    this.engineSet(key, this.input(val))
  }

  getItem (key) {
    return this.output(this.engineGet(key))
  }

  set (key, val, timeout = 0) {
    if (timeout > 0) {
      this.setWithTime(key, timeout)
    }
    this.setItem(key, val)
  }

  get (key) {
    if (!this.getWithTime(key)) {
      return null
    }
    return this.getItem(key)
  }

  remove (key) {
    wx.removeStorageSync(key)
  }
}