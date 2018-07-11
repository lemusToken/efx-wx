export default (url, method = 'GET', data = {}, header = {}) => {
  method = method.toUpperCase()
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header,
      success: function (res) {
        resolve(res)
      },
      fail: function (msg) {
        reject(msg)
      }
    })
  })
}