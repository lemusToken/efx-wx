import Component from '../../app/component.js'
import {Storage} from '../../data/index.js'
import Sys from '../../app/sys.js'
const ONCE_MAP = Symbol('ONCE_MAP')
const StorageWx = Storage('WxGlobal')
/**
 * 组件：一次加载组件
 * once标签中的内容页面中只注册一次
 * @author xule
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  组件名称，默认是当前页面地址
    name: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isExist: false
  },
  //  微信小程序组件的销毁只有在回退页面时
  //  每次页面跳转(非tab)都会创建组件
  attached() {
    //  当前页面对象
    const currentPage = Sys.get('getCurrentPage')
    this.setData({
      name: this.data.name || currentPage.route
    })
    let total = 1
    StorageWx.set(ONCE_MAP, StorageWx.get(ONCE_MAP) || new WeakMap())
    const map = StorageWx.get(ONCE_MAP)
    if (!map.get(currentPage)) {
      map.set(currentPage, {
        [this.data.name]: total
      })
    }
    else {
      let data = map.get(currentPage)
      data[this.data.name] = data[this.data.name] || 0
      data[this.data.name] += 1
      total = data[this.data.name]
      map.set(currentPage, data)
    }
    this.setData({
      num: total
    })
  },

  detached () {
    const currentPage = Sys.get('getCurrentPage')
    StorageWx.get(ONCE_MAP) && StorageWx.get(ONCE_MAP).delete(currentPage)
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },
})
