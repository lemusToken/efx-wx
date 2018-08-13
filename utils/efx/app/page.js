import Event from '../observer/event.js'
import Sys from './sys.js'

/**
 * @param {object} data 页面数据
 * @param {boolean} run 是否运行页面，false只返回数据
 */
const PageContainer = function (data, run = true) {
  if (!data.onLoad) {
    data.onLoad = () => { }
  }
  for (let v of Object.keys(data)) {
    if (v.indexOf('on') > -1 && typeof data[v] === 'function') {
      let fn = data[v]
      data[v] = (...params) => {
        const page = Sys.get('getCurrentPage')
        
        Event.emitWith(page, 'page/' + v, ...params)
        fn.apply(page, params)
      }
    }
  }
  if (run) {
    Page(data)
  }
  return data
}

//  数据合并
PageContainer.extend = (pData, data, params = {}) => {
  data = { ...pData, ...data }
  data.getExtendParam = (key) => {
    return key ? params[key] : params
  }
  PageContainer(data, true)
  return data
}

export default PageContainer