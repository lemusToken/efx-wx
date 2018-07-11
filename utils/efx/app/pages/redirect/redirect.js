//  二次跳转页
//  可用于小程序业务二维码的跳转
import Url from '../../../tools/url.js'
export default {

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const extendParams = this.getExtendParam()
    wx.showLoading({
      title: '页面加载中...',
    })
    //  默认跳转地址
    let path = extendParams.homePath || '/pages/index/index'
    //  菜单路径列表
    const menuList = extendParams.menuList || []
    //  路径参数中的跳转地址的参数名称列表
    const urlList = extendParams.urlKeys || ['p', 'pp']
    //  如果是网页地址所需要跳转的web页路径
    const webPath = extendParams.webPath || '/pages/web/web?url='
    let redirectData = {}
    //  路径中的跳转地址参数
    const q = options.q
    if (!q) return
    const dataUrl = Url.parse(decodeURIComponent(q), /\{.*?\}/g)
    //  解析最终跳转地址
    let p
    for (let v of urlList) {
      if (dataUrl.params[v]) {
        p = dataUrl.params[v]
        break
      }
    }
    if (p) {
      redirectData = JSON.parse(decodeURIComponent(p))
      path = redirectData.path
    }
    //  switchtab不能带参数
    if (menuList.indexOf(path)>-1) {
      wx.switchTab({
        url: path,
        complete () {
          wx.hideLoading()
        }
      })
    }
    else if (path.indexOf('http') > -1) {
      wx.redirectTo({
        url: webPath + encodeURIComponent(path),
        complete() {
          wx.hideLoading()
        }
      })
    }
    else {
      wx.redirectTo({
        url: path,
        complete() {
          wx.hideLoading()
        }
      })
    }
  }
}