import {Clone} from '../../efx/data/index.js'

/**
 * 缓存配置实例
 * @type {object}
 */
const CACHE_CONFIG = {}

/**
 * 配置管理
 * @author xule
 */
class ConfigManager {
  /**
   * 初始化
   */
  constructor () {
    this.dataObj = Clone({})
  }

  /**
   * 合并配置
   * @param {object} data 数据
   * @return {ConfigManager}
   */
  add (data) {
    let copy = false
    //  当是配置实例时，深拷贝一份
    if (data instanceof ConfigManager) {
      data = data.get()
      copy = true
    }
    this.dataObj.merge(data, copy)
    return this
  }

  /**
   * 获取配置
   * @return {Object|array}
   */
  get () {
    return this.dataObj.get()
  }
}

/**
 * 配置，以名称作为单例存储键名
 * @param {string} name 配置名称，有名称才会存储为单例
 * @returns {ConfigManager}
 */
export default (name) => {
  let inst = CACHE_CONFIG[name]
  if (inst && name) {
    return inst
  }
  inst = new ConfigManager()
  CACHE_CONFIG[name] = inst
  return inst
}
