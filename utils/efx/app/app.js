import {Ob, Event} from '../observer/index.js'
import Config from '../config/config.js'
import * as ConfigAll from '../../../configs/index.js'
import Sys from './sys.js'
import Version from '../config/version.js'

const AppConfig = ConfigAll.app
const APPID = Math.random() * 1000000 | 0
const VERSION = AppConfig.VERSION
const ENV_PROD = 'production'
const ENV_DEV = 'development'
const map = [
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

export default (data={}) => {
  let launch = data.onLaunch
  data.onLaunch = function (...params) {
    if (typeof launch === 'function') {
      launch.apply(this, params)
    }
    Sys.define('$STORE', this.Store)
    Version.setCurrent(VERSION)
    if (this.Store) {
      const Store = this.Store
      //  绑定store，监听getter
      Event.on('page/onLoad', function () {
        this.$Store = Store
        const getters = this.storeGetters
        if (getters) {
          Store.bindGetters((name, val) => {
            this.setData({
              [name]: typeof val === 'undefined' ? '' : val
            })
          }, getters, this.route)
        }
      })
    }
    //  监听页面事件
    for (let v of map) {
      if (!this.page || !this.page[v]) continue
      Event.on(`page/${v}`, this.page[v])
    }
  }
  data.globalData = data.globalData || {}
  App(data)
}