import {Storage, Ifs} from '../data/index.js'
const store = Storage('WxLocal', 'WinLocal')

export default class Version {
  static setCurrent (v) {
    store.set('VERSION', v)
  }

  static getCurrent () {
    return store.get('VERSION')
  }

  static clear (v) {
    if (Ifs.is('Number', v[0] - 0)) {
      return v
    }
    else {
      return v.replace(/^.*?\d/, '')
    }
  }

  //  判断版本是否落后
  static isLag (v) {
    return Version.compare(Version.getCurrent(), v, '>')
  }

  //  大版本（主版）.小版本（次版）.日常版本
  static compare (v, v1, type) {
    if (type === '=') {
      return v === v1
    }
    const partsV = Ifs.is('Array', v) ? v : Version.clear(v).split('.')
    const partsV1 = Ifs.is('Array', v1) ? v1 : Version.clear(v1).split('.')
    if (type === '>') {
      partsV[0] -= 0
      partsV[1] -= 0
      partsV[2] -= 0
      //  首位比较
      if (partsV[0] > partsV1[0]) {
        return true
      }
      else if (partsV[0] < partsV1[0]) {
        return false
      }
      //  次位比较
      if (partsV[1] > partsV1[1]) {
        return true
      }
      else if (partsV[1] < partsV1[1]) {
        return false
      }
      //  末尾比较
      return partsV[2] > partsV1[2]
    }
    if (type === '<') {
      return !Version.compare(v, v1, '=') && !Version.compare(v, v1, '>')
    }
  }
}