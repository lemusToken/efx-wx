/**
 * 系统内部数据或方法
 */
const DATA = {}

export default {
  get (key, ...params) {
    const v = DATA[key]
    if (typeof v === 'function') {
      return v(...params)
    }
    return v
  },
  //  属性只读
  define (key, value) {
    Reflect.defineProperty(DATA, key, {
      value,
      configurable: false,
      writable: false
    })
  }
}