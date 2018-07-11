import Component from '../../app/component.js'
import {Storage} from '../../data/index.js'
const StorageWx = Storage('WxGlobal')

/**
 * 组件：链接跳转
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  block类型
    blockType: {
      type: String,
      value: 'inline'
    },
    //  链接类型
    linkType: {
      type: String,
      value: ''
    },
    height: {
      type: String,
      value: 'auto'
    },
    width: {
      type: String,
      value: 'auto'
    },
    //  链接地址
    url: {
      type: String,
      value: ''
    },
    //  网址跳转地址
    web: {
      type: String,
      value: '/pages/web/web?u='
    },
    //  埋点服务地图
    pointServerMap: {
      type: Object,
      value: {}
    },
    //  埋点类型（方法）
    pointType: {
      type: String,
      value: ''
    },
    //  埋点值
    pointVal: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    go () {
      this.point()
      let url = this.data.url
      if (!url) return
      let jump = wx.navigateTo
      if (this.data.linkType === 'redirect') {
        jump = wx.redirectTo
      }
      else if (this.data.linkType === 'tab') {
        jump = wx.switchTab
      }
      //  跳转webview
      if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
        url = encodeURIComponent(url)
        jump({
          url: this.data.web+url
        })
      }
      else {
        jump({
          url
        })
      }
    },
    point() {
      const map = this.data.pointServerMap || StorageWx.get('linkPointServerMap')
      const tp = this.data.pointType
      if (typeof map === 'object' && typeof map[tp] === 'function') {
        map[tp](this.data.pointVal)
      }
    }
  }
})
