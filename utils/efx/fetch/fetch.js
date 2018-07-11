import WxFetch from './wx.fetch.js'

const isWx = typeof wx === 'object' && typeof wx.request === 'function'

/**
 * ajax请求
 */
export default function (url, method = 'GET', data = {}, header = {}) {
  if (isWx) {
    return WxFetch(...arguments)
  }
  return require('./win.fetch.js')(...arguments)
}