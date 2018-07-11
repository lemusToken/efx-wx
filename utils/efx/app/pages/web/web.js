export default {
  /**
   * 页面的初始数据
   */
  data: {
    //  h5网页地址
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const url = this.getExtendParam('url') || 'url'
    const src = options[url] || ''
    this.setData({
      src: decodeURIComponent(src)
    })
  }
}