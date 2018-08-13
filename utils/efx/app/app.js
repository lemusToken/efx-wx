import {Ob, Event} from '../observer/index.js'
import Config from '../config/config.js'
import * as ConfigAll from '../../../configs/index.js'
import Sys from './sys.js'
import Version from '../config/version.js'
import Use from '../../efx/app/plugins/use.js'
import WxStoreBind from '../../efx/store/connect/wx.js'

const AppConfig = ConfigAll.app
const APPID = Math.random() * 1000000 | 0
const VERSION = AppConfig.VERSION
const PAGE_EVENT_PREV = 'page/on'
const ENV_PROD = 'production'
const ENV_DEV = 'development'
const mapApp = [
  'onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound'
]
const mapPage = [
  'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh',
  'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap'
]

AppConfig.APPID = APPID
//  生成所有配置实例
createConfig(ConfigAll)
//  当前环境配置实例
let config = ConfigAll[AppConfig.ENV] || ConfigAll[ENV_DEV]
Config('current').add(config)

Sys.define('APPID', APPID)
Sys.define('uKey', Math.random() * 100000 | 0)
Sys.define('ENV', AppConfig.ENV)
Sys.define('VERSION', VERSION)
Sys.define('APP_VAR', AppConfig)
Sys.define('getCurrentPage', () => {
  const pages = getCurrentPages()
  return pages ? pages[pages.length - 1] : null
})
Sys.define('uName', (name) => {
  return name + '-' + Sys.get('uKey')
})

function createConfig (config) {
  for (let v of Object.keys(config)) {
    Config(v).add(config[v])
  }
}

Event.on('app/onLaunch', function () {
  Version.setCurrent(VERSION)
  if (this.Store) {
    Sys.define('$STORE', this.Store)
    const Store = this.Store
    //  绑定store，监听getter
    Event.on('page/onLoad', function () {
      this.$Store = Store
      WxStoreBind(Store, this)
    })
  }
  //  监听页面事件
  for (let v of mapPage) {
    if (!this.page || !this.page[v]) continue
    Event.on(`page/${v}`, this.page[v])
  }
})

const appLaunch = (data = {}) => {
  for (let v of mapApp) {
    if (!data[v]) continue
    Event.on(`app/${v}`, data[v])
    data[v] = null
  }
  //  添加扩展
  data = Use.extend(data)
  for (let v of Object.keys(data)) {
    if (v.indexOf('on') === 0) {
      if (typeof data[v] === 'function') {
        Event.on(`app/mixin/${v}`, data[v])
      }
      data[v] = function (...params) {
        Event.emitWith(this, `app/${v}`, ...params)
        Event.emitWith(this, `app/mixin/${v}`, ...params)
      }
    }
  }
  data.globalData = data.globalData || {}
  App(data)
}

appLaunch.use = Use.add

export default appLaunch