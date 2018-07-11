import Ifs from '../ifs'

/**
 * 数据存储
 * window.localStorage;window.sessionStorage;cookie;{};wx.getStorageSync;wx.globalData
 * @author xule
 */
export default class Base {
  constructor () {
    this.abstractCheck()
    this.key = {
      timeout: '_TIMEOUT_'
    }
    this.engine = false
  }
  //  判断浏览器环境
  isWindow () {
    return typeof window !== 'undefined'
  }
  isDocument () {
    return typeof document !== 'undefined'
  }
  //  判断微信小程序
  isWxMini () {
    return typeof wx !== 'undefined' && typeof getApp === 'function'
  }
  input (val) {
    return val ? JSON.stringify(val) : val
  }
  output (val) {
    return Ifs.realEmpty(val) ? val : JSON.parse(val)
  }
  //  键名处理
  keyed (type, str) {
    return this.key[type] ? str + this.key[type] : str
  }
  //  有超时时间时的数据设置
  //  time ms
  setWithTime (key, time) {
    let keyTime = this.keyed('timeout', key)
    let now = new Date().getTime()
    let storedTime = this.getItem(keyTime)
    if (!storedTime) {
      this.setItem(keyTime, now + time)
    }
  }
  //  有超时时间时的数据获取
  getWithTime (key) {
    let now = new Date().getTime()
    let keyTime = this.keyed('timeout', key)
    let storedTime = this.getItem(keyTime)
    //  超时
    if (storedTime && now > storedTime) {
      this.remove(key)
      this.remove(keyTime)
      //  已过期
      return false
    }
    //  未过期
    return true
  }
  //  抽象接口检查
  abstractCheck () {
    if (typeof this.check !== 'function') {
      throw new Error('the function check is required!')
    }
    if (typeof this.setItem !== 'function') {
      throw new Error('the function setItem is required!')
    }
    if (typeof this.set !== 'function') {
      throw new Error('the function set is required!')
    }
    if (typeof this.getItem !== 'function') {
      throw new Error('the function getItem is required!')
    }
    if (typeof this.get !== 'function') {
      throw new Error('the function get is required!')
    }
    if (typeof this.remove !== 'function') {
      throw new Error('the function remove is required!')
    }
  }
}