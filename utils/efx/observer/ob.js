/**
 * 数据观察
 * @author xule
 */
class Ob {
  constructor () {
    this.qFlagSet = {}
    this.qFlagWatch = {}
    this.qVal = {}
    this.qWatch = {}
    //  状态
    this.data = {}
  }

  /**
   * 监听数据变化
   * @param {string} name 数据名称
   * @param {callback} fn 数据变更后的回调函数
   * @param {string} onceFlag 只添加一次的标识
   */
  watch(name, fn, onceFlag = '') {
    if (onceFlag) {
      if (this.qFlagWatch[name + '-' + onceFlag]) return
      this.qFlagWatch[name + '-' + onceFlag] = true
    }
    this.qWatch[name] = this.qWatch[name] || []
    this.qWatch[name].push(fn)
    return this
  }

  removeWatch (name) {
    if (this.qWatch[name]) {
      this.qWatch[name] = null
      this.qFlagSet[name] = null
    }
  }

  //  设置观察者以及设置值
  setData (name, val) {
    //  只执行一次
    if (!this.qFlagSet[name]) {
      Object.defineProperty(this.data, name, {
        get: () => {
          return this.qVal[name]
        },
        set: (val) => {
          if (Array.isArray(this.qWatch[name])) {
            for (let v of this.qWatch[name]) {
              try {
                v(val, name)
              }
              catch (e) {

              }
            }
          }
          this.qVal[name] = val
        }
      })
      this.qFlagSet[name] = true
    }
    this.data[name] = val
    return this
  }
}

export default new Ob() 