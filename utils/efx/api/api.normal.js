import Base from './api.base.js'

class ApiNormal extends Base {
  constructor () {
    super()
  }
  fetchToken (...params) {
    const config = this.config[this.namespace.TOKEN] || []
    let data = ApiNormal._combineParams(params, config)
    return super.fetchToken(...data).then((fn) => {
      if (typeof fn === 'function') {
        let result = ''
        //  向服务器请求token
        return fn().then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (typeof this.config[this.namespace.TOKEN_SAVE] === 'function') {
            result = this.config[this.namespace.TOKEN_SAVE](res, 'normal')
            this.storage.set(this.namespace.TOKEN_SAVED_NAME, result, this.config[this.namespace.TOKEN_TIME] || 0)
          }
          return result
        })
        return result
      }
      else {
        return fn
      }
    })
  }
  fetchWithToken (url, ...params) {
    return this.fetchToken().then((token) => {
      params[1] = { ...{
        [this.config[this.namespace.TOKEN_NAME]]: token
      }, ...(params[1] || {}) }
      return this.fetch(url, ...params)
    })
  }
  fetchWithMap (path, ...params) {
    let args = this.parseMapPath(path)
    let data = ApiNormal._combineParams(params, args)
    return this.fetch(...data)
  }
  fetchWithTokenMap(path, ...params) {
    let args = this.parseMapPath(path)
    let data = ApiNormal._combineParams(params, args)
    return this.fetchWithToken(...data)
  }
  //  参数合并
  static _combineParams(params, args) {
    let data = []
    //  没有参数时直接用args覆盖
    if (params.length === 0) {
      data = args
    }
    //  只有一个参数并且是对象时，只合并args中的第2个参数
    else if (params.length === 1 && typeof params[0] === 'object') {
      data[0] = args[0]
      data[1] = args[1]
      data[2] = { ...(args[2] || {}), ...params[0] }
      data[3] = args[3]
    }
    //  合并对应的args
    else {
      data[0] = params[0] || args[0]
      data[1] = params[1] || args[1]
      data[2] = typeof params[2] === 'object' ? { ...(args[2] || {}), ...params[2] } : args[2]
      data[3] = typeof params[3] === 'object' ? { ...(args[3] || {}), ...params[3] } : args[3]
    }
    return data
  }
}

export default new ApiNormal()