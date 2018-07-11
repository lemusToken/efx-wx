/**
 * 中间件处理
 * @author xule
 */
const NEXT = 'next'
export default class Middelware {
  constructor(fn, actName = NEXT) {
    this.queue = []
    this.res = {}
    //  初始化直接执行输入的函数
    this.use(fn, actName)
    setTimeout(() => {
      this.next({})
    }, 0)
  }
  parseWare (ware, actName = NEXT) {
    if (!ware) return
    if (typeof ware[actName] === 'function') {
      return ware[actName].bind(ware)
    }
    if (typeof ware === 'function') {
      return ware
    }
  }
  use (fn, actName = NEXT) {
    fn = this.parseWare(fn, actName)
    if (typeof fn !== 'function') return this
    this.queue.push(fn)
    return this
  }
  next (context = {}, next) {
    if (this.queue && this.queue.length > 0) {
      let m = this.queue.shift()
      m(context, this.next.bind(this))
    }
  }
}