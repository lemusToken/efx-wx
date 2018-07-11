import Config from '../config/config.js'
import Fetch from '../fetch/fetch.js'
import { Storage, Ifs } from '../data/index.js'

const TOKEN_SAVED_NAME = 'TOKEN'
const TOKEN = 'token'
const TOKEN_NAME = 'tokenName'
const TOKEN_SAVE = 'tokenSave'
const TOKEN_TIME = 'tokenCacheTime'
const API_SERVE = 'apiServer'

const weakMap = new WeakMap()

/**
 * api请求
 * @author xule
 */
export default class Base {
  constructor () {
    this.namespace = {
      TOKEN, TOKEN_SAVE, TOKEN_TIME, TOKEN_SAVED_NAME, TOKEN_NAME, API_SERVE
    }
    this.Config = Config
    this.storage = Storage('WinLocal', 'WxLocal')
    this.map = Config('apiMap').get()
    this.config = this.Config('current').get()
  }
  fetch (url, ...params) {
    url = this.parseUrl(url)
    return Fetch(url, ...params)
  }
  fetchToken (...params) {
    let token = this.storage.get(TOKEN_SAVED_NAME)
    return new Promise((resolve, reject) => {
      //  如果token缓存存在
      if (token) {
        resolve(token)
      }
      //  如果缓存不存在
      else {
        resolve(() => {
          return this.fetch(...params)
        })
      }
    })
  }
  //  解析url中的apiserver地址
  parseUrl (url) {
    if (!url || typeof url !== 'string') return ''
    const config = this.config
    if (url.indexOf('{') > -1 && url.indexOf('}') > -1) {
      url =  url.replace(/{(.*?)}/g, function (w, m) {
        let result = ''
        if (m.indexOf('.') > -1) {
          let l = m.split('.')
          result = config[l[0]] ? (Ifs.is('Array', config[l[0]]) ? config[l[0]][l[1]] : config[l[0]]) : ''
        }
        else {
          result = config[m] ? (config[m] instanceof Array ? config[m][0] : config[m]) : ''
        }
        return result || w
      })
    }
    return url
  }
  //  通过api地图路径中获取具体参数
  parseMapPath (path, map = this.map) {
    let result
    if (path.indexOf('.') > -1) {
      const paths = path.split('.')
      for (let v of paths) {
        result = map[v]
        map = result
      }
    }
    else {
      result = map[path]
    }
    return result
  }
}