import Sys from './sys.js'

/**
 * @param {object} data 组件数据
 * @param {boolean} run 是否运行组件，false只返回数据
 */
const ComponentContainer = function (data, run = true) {
  data.methods = data.methods || {}
  //  绑定store
  const Store = Sys.get('$STORE')
  data.methods.$Store = () => Store
  let attached = data.attached
  let detached = data.detached
  data.attached = function (...params) {
    //  监听getter
    const getters = this.storeGetters ? this.storeGetters() : null
    if (getters) {
      Store.bindGetters((name, val) => {
        this.setData({
          [name]: typeof val === 'undefined' ? '' : val
        })
      }, getters)
    }
    typeof attached === 'function' && attached.apply(this, params)
  }
  data.detached = function (...params) {
    const getters = this.storeGetters
    //  移除监听的getter
    Store.removeBindGetter(getters)
    typeof detached === 'function' && detached.apply(this, params)
  }
  if (run) {
    Component(data)
  }
  return data
}

//  数据合并
ComponentContainer.extend = (pData, data, params = {}) => {
  data = { ...pData, ...data }
  data.getExtendParam = (key) => {
    return key ? params[key] : params
  }
  ComponentContainer(data, true)
  return data
}

export default ComponentContainer