import Ifs from './ifs.js'

//  缓存对象
const WeakMaps = new WeakMap()
//  缓存阈值
const CACHE_MAX_SIZE = 50
//  当前缓存数
let CACHE_CURRENT_SIZE = 0

/**
 * 数据深浅拷贝，数据合并
 * @author xule
 */
class Clone {
  /**
   * 初始化对象
   * @param {object|array} target 被操作对象
   */
  constructor (target) {
    this.target = target
  }

  /**
   * 设置对应项值
   * @param {string|array} path 可以是带有.的路径(.表示嵌套)，也可以是数组
   * @param {*} val 值
   * @returns {Clone}
   */
  set (path, val) {
    if (!path) return
    this.target = this.merge(this.target, Clone.path2Obj(path, val), true)
    return this
  }

  /**
   * 合并多项值
   * @param {array} sources 需要合并的数据数组
   * @param {object|array} [target=this.target] 被操作对象，默认由构造函数指定
   * @param {boolean} [copy=true] 是否需要拷贝，否则对象结构共享(引用)
   * @return {object|array}
   */
  merges (sources, target = this.target, copy = true) {
    for (let v of sources) {
      target = this.merge(v, target, copy)
    }
    return target
  }

  /**
   * 对象合并，拷贝时，只对需要的对象进行拷贝，其余对象保持引用，内存共享（同一个地址）
   * - 只对需要合并的对象进行合并，其余保持不变，结构共享
   * - 当第二项是布尔值时，表示copy
   * @param {object|array} source 待合并的对象
   * @param {object|array} [target=this.target] 被操作对象，默认由构造函数指定
   * @param {boolean} [copy=true] 是否需要拷贝，否则对象结构共享(引用)
   * @returns {object|array}
   */
  merge (source, target = this.target, copy = true) {
    if (Ifs.is('Boolean', target)) {
      copy = target
      target = this.target
    }
    else if (!target) {
      copy = true
      target = this.target
    }
    //  如果对象相同
    if (source === target) {
      return target
    }
    //  都是数组，直接合并数组后返回
    if (Ifs.is('Array', source) && Ifs.is('Array', target)) {
      return [...target, ...source]
    }
    if (copy) {
      //  当前层拷贝
      target = this.clone(target)
    }
    //  递归对象
    for (let key in source) {
      if (!source.hasOwnProperty(key)) continue
      //  如果source是引用类型
      if (typeof source[key] === 'object') {
        target[key] = target[key] || (Ifs.is('Array', source[key]) ? [] : {})
        target[key] = this.merge(source[key], target[key], copy)
      }
      else {
        target[key] = source[key]
      }
    }
    this.target = target
    return this.target
  }

  /**
   * 获取合并后对象
   * @return {object|array}
   */
  get () {
    return this.target
  }

  /**
   * 深拷贝，对每一层进行拷贝
   * @param {object|array} [source=this.target] 被操作对象
   * @returns {object|array}
   */
  cloneDeep (source = this.target) {
    return this.merge(source, {}, true)
  }

  /**
   * 浅拷贝，只对最外层就行拷贝，内层数据保持结构共享
   * @param {object|array} [source=this.target] 被操作对象
   * @returns {object|array}
   */
  clone (source = this.target) {
    let target = null
    if (Ifs.is('Array', source)) {
      target = [...[], ...source]
    }
    else if (typeof source === 'object') {
      target = {...{}, ...source}
    }
    else {
      target = source
    }
    return target
  }

  /**
   * 通过路径生成树结构
   * @param {string|array} path 路径
   * @param value
   * @returns {object}
   */
  static path2Obj (path, value) {
    if (typeof path === 'string') {
      path = path.split('.')
    }
    const len = path.length
    let ps = {}
    let result
    if (len === 1) {
      ps[path[0]] = value
      return ps
    }
    for (let i = 0; i < len; i++) {
      let val = path[i]
      ps[val] = {}
      if (i === 0) {
        result = ps
      }
      else if (i === len - 1) {
        ps[val] = value
      }
      ps = ps[val]
    }
    return result
  }
}

/**
 * 数据合并
 * @param {object|array} obj 被操作对象
 * @return {Clone}
 */
export default (obj) => {
  let inst = WeakMaps.get(obj)
  if (inst) {
    inst.target = obj
    return inst
  }
  inst = new Clone(obj)
  if (CACHE_CURRENT_SIZE >= CACHE_MAX_SIZE) {
    CACHE_CURRENT_SIZE = 0
  }
  WeakMaps.set(obj, inst)
  CACHE_CURRENT_SIZE += 1
  return inst
}