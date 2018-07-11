import WinLocal from './win.localstorage'
import WinSession from './win.sessionstorage'
import WinCookie from './win.cookie'
import Normal from './normal'
import WxGlobal from './wx.global'
import WxLocal from './wx.localstorage'

//  实例缓存
const CACHE_ENGINES = {}

export default function storage (...ens) {
  let type = 'Normal'
  if (ens && ens.length) {
    type = ens.shift()
  }
  let inst = CACHE_ENGINES[type]
  if (inst) {
    return inst
  }
  switch (type) {
    case 'WxGlobal':
      inst = new WxGlobal()
      break
    case 'WxLocal':
      inst = new WxLocal()
      break
    default:
      inst = new Normal()
      break
  }
  CACHE_ENGINES[type] = inst.check() ? inst : storage.apply(this, ens)
  return CACHE_ENGINES[type]
}