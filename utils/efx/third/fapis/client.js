import Client from './base.js'
const isWx = typeof wx === 'object' && typeof wx.request === 'function'

/**
 * ajax请求
 */
export default (() => {
  if (isWx) {
    return require('./wx.client.js').default
  }
  return require('./win.client.js').default
})()