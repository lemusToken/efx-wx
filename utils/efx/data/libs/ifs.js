/**
 * 数值类型判断
 * @author xule
 */
export default {
  isNull (val) {
    return val === null
  },
  //  Object,Boolean,Number,String,Function,Array,Date,RegExp,Object,NodeList,HTMLCollection,Map,WeakMap,Set,WeakSet等
  is (type, val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`
  },
  isNodeList (val) {
    return this.is('NodeList', val) || this.is('HTMLCollection', val)
  },
  isNode (val) {
    return Object.prototype.toString.call(val).indexOf('[object HTML') > -1
  },
  //  判断是否有原型链
  isPlainObj (val) {
    return val && (val.constructor === Object || val.constructor === undefined)
  },
  maybeArray (val) {
    return this.is('Array', val) || this.isNodeList(val)
  },
  //  判断空值，{}, [], null, undefined, 0, ''
  realEmpty (val) {
    if (!val) return true
    if (this.is('Number', val)) {
      return val === 0
    }
    else if (this.maybeArray(val)) {
      return val.length === 0
    }
    else if (this.is('Object', val)) {
      let flag = true
      for (let i in val) {
        if (val.hasOwnProperty(i)) {
          flag = false
          break
        }
      }
      return flag
    }
    else {
      return val.length === 0
    }
  }
}