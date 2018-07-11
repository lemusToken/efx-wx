import {Storage} from '../../data/index.js'
import Config from '../../config/config.js'
import Fetch from '../../fetch/fetch.js'
import md5 from '../../tools/md5.js'
import sha1 from '../../tools/sha1.js'
import * as FapisConfigAll from '../../../client/fapis/index.js'

const storage = Storage('WxLocal', 'WinLocal')
const configCurrent = Config('current').get()
let config

const fn = {
  getTimestamp: function () {
    return parseInt(new Date().getTime() / 1000)
  },
  getRand: function () {
    return parseInt(Math.random() * (99999999 - 10000000 + 1) + 10000000, 10)
  },
  getPubKey: function () {
    return config.sign_pub_key
  },
  getPrivateKey: function (packName) {
    let keyPrivate
    let pubKeyList = config.package_security_pub_key
    let path = packName.split('.')
    for (let v of path) {
      if (pubKeyList[v]) {
        pubKeyList = pubKeyList[v]
        if (pubKeyList._) {
          keyPrivate = pubKeyList._
          break
        }
      }
      else {
        break
      }
    }
    pubKeyList = null
    return keyPrivate
  },
  createChecksum: function (packName, clsName) {
    const timestamp = this.getTimestamp()
    const keyPrivate = this.getPrivateKey(packName)
    const checksum = md5(`${timestamp}${packName}${clsName}${keyPrivate}`)
    return { checksum, timestamp }
  },
  createSign: function (packName, clsName, params = {}) {
    const { checksum, timestamp } = this.createChecksum(packName, clsName)
    params.package = packName
    params.class = clsName
    params.checksum = checksum
    const paramsStr = JSON.stringify(params)
    const rand = this.getRand()
    const keyPub = this.getPubKey()
    const sign = sha1(`${paramsStr}${timestamp}${rand}${keyPub}`)
    return { sign, timestamp, rand }
  }
}

/**
 * fapis
 * @author xule
 */
export default (env) => {
  config = FapisConfigAll[env]
  return (packName, clsName, params = {}) => {
    const { sign, timestamp, rand } = fn.createSign(packName, clsName, params)

    return Fetch(config.url, 'POST', params, {
      'content-type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Signature': sign,
      'UTC-Timestemp': timestamp,
      'Random': rand
    })
  }
}