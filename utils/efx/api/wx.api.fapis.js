import Fapis from './api.fapis.js'

class WxApiFapis extends Fapis {
  constructor () {
    super()
  }
  //  微信小程序必须登录后才能获取code
  //  约定：接口接受code参数
  fetchToken (...params) {
    return this._wxCode().then((code) => {
      params[2] = {...params[2], ...{code}}
      return super.fetchToken(...params)
    }, res => {
      throw new Error(res)
    })
  }
  fetchLoadingWithToken (packName, clsName, params = {}) {
    wx.showLoading({
      title: '请稍候'
    })
    return this.fetchWithToken(packName, clsName, params).then((res) => {
      wx.hideLoading()
      return res
    })
  }
  _wxCode () {
    return new Promise((resolve, reject)=>{
      //  微信登录成功后，返回code
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          }
          else {
            reject(res)
          }
        }
      })
    })
  }
}

export default new WxApiFapis()