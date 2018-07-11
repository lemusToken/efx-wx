/**
 * 事件观察者，事件注册以及触发
 * @author xule
 */
class Event {
  /**
   * 初始化成员变量
   */
  constructor() {
    /**
     * 事件队列
     * @access private
     * @type {Array}
     */
    this.queue = []
    /**
     * 只注册一次的标识（once）
     * @access private
     * @type {{}}
     */
    this.oneFlag = {}
    /**
     * 队列序号
     * @access private
     * @type {{}}
     */
    this.nums = {}
  }

  /**
   * 触发后立即销毁
   * @access public
   * @param {string} type 事件类型
   * @param {callback} fn 回调函数
   */
  once(type, fn) {
    this.on(type, fn, true)
  }

  /**
   * 事件只会注册一次，并且保留最近的一次
   * @access public
   * @param {string} type 事件类型
   * @param {callback} fn 回调函数
   */
  one(type, fn) {
    if (typeof this.oneFlag[type] !== 'undefined') {
      this.queue[this.oneFlag[type] - 1] = this.queueData(type, fn)
      return
    }
    this.oneFlag[type] = this.on(type, fn)
  }

  /**
   * 事件注册
   * @param {string} type 事件类型
   * @param {callback} fn 回调
   * @param {boolean} once 建议直接调用once方法
   * @returns {Number}
   */
  on(type, fn, once = false) {
    if (typeof fn !== 'function') return
    return this.queue.push(this.queueData(type, fn, once))
  }

  /**
   * 事件注销
   * @param {string} type 事件类型
   */
  off(type) {
    let len = 0
    for (let i = 0; i < this.queue.length; i++) {
      let v = this.queue[i]
      if (!v) {
        len += 1
        continue
      }
      if (v.type === type) {
        this.queue[i] = null
        len += 1
      }
    }
    if (len === this.queue.length) {
      this.queue = []
    }
  }

  /**
   * 事件触发
   * @param {string} type 事件类型
   * @param {...*} params on回调函数中的参数
   */
  emit(type, ...params) {
    let context = null
    if (!type) {
      type = params.shift()
    }
    else if (typeof type === 'object') {
      context = type
      type = params.shift()
    }
    const queue = this.queue
    for (let v of queue) {
      if (!v) continue
      if (v.type === type && typeof v.fn === 'function') {
        context ? v.fn.apply(context, params) : v.fn(...params)
        if (v.once) {
          this.off(v.type)
        }
      }
    }
  }

  /**
   * 事件触发，重写on回调函数的this上下文
   * @param {*} obj 上下文
   * @param {string} type 事件类型
   * @param {...*} params on回调函数中的参数
   */
  emitWith(obj, type, ...params) {
    this.emit(obj, type, ...params)
  }
  /**
   * 生成队列数据
   * @access private
   * @param type
   * @param fn
   * @param once
   * @returns {{type: *, fn: *, once: *, index: *}}
   */
  queueData(type, fn, once) {
    this.nums[type] = this.nums[type] || 0
    const result = {
      type,
      fn,
      once,
      index: this.nums[type]
    }
    this.nums[type] += 1
    return result
  }
}

export default new Event()