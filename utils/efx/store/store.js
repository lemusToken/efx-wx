import {Ob} from '../observer/index.js'

/**
 * 缓存实例
 * @type {Store}
 */
let CACHE_INST
/**
 * 保存state的值
 * @type {object}
 */
let STATE = {}

/**
 * 状态管理，与vuex类似
 * - 提交状态变更：业务->dispatch->action->commit->state
 * - 获取状态：getter
 * @author xule
 */
class Store {
  /**
   * 添加modules数据
   * @param {object} config modules数据
   */
  constructor (config) {
    this.dispatch = this.dispatch.bind(this)
    /**
     * 根状态，其实就是config
     * @type {Object}
     */
    this.rootState = config
    /**
     * 随机值
     * @type {number}
     */
    this.hid = Math.random() * 10000 | 0
    /**
     * 获取合并处理后的actions和getters
     * @type {{actions: object}}
     */
    const { actions = {} } = this.combineModules(config)
    this.allActions = actions
  }

  /**
   * 调用方法
   * @param {string} name 方法名，方法名格式为：模块名 + '/' + name
   */
  dispatch (name) {
    typeof this.allActions[name] === 'function' && this.allActions[name](this.dispatch, this.rootState)
  }

  /**
   * 业务代码与getter绑定，将getter的返回值映射到业务中使用的变量
   * @param {function} fn 与业务进行绑定的操作
   * @param {object} getters getter列表，格式：{模块名/getter名: 当前业务使用的变量名}
   * @param {string} watchFlag 对当前getter数据变化进行监听的唯一标识
   */
  bindGetters (fn, getters, watchFlag = '') {
    for (let i in getters) {
      if (!getters.hasOwnProperty(i)) continue
      //  监听getter的数据变化
      Ob.watch(
        this.getStoredObKey(i),
        (v, name) => {
          //  getter对应的业务名，getter返回的值
          fn(getters[i], v)
        },
        watchFlag
      )
      fn(getters[i], Ob.data[this.getStoredObKey(i)])
    }
  }

  /**
   * 解除绑定
   * @param {object} getters getter列表，格式：{模块名/getter名: 当前业务使用的变量名}
   */
  removeBindGetter (getters) {
    for (let i in getters) {
      if (!getters.hasOwnProperty(i)) continue
      Ob.removeWatch(this.getStoredObKey(i))
    }
  }

  /**
   * 合并各个module中的数据
   * - 合并actions和getters
   * - 给各module中的状态添加描述符
   * @access private
   * @param {object} config 各个modules的值
   * @return {object}
   */
  combineModules (config) {
    if (!config.modules) return
    let actions = {}
    let getters = {}
    //  key是module的名称
    for (let key in config.modules) {
      if (!config.modules.hasOwnProperty(key)) continue
      let currentGetters = {}
      let val = config.modules[key]
      STATE[key] = STATE[key] || {}
      //  遍历module中的各项值
      for (let v in val) {
        if (!val.hasOwnProperty(v)) continue
        let path = ''
        //  actions合并
        if (v === 'actions') {
          for (let vv in val[v]) {
            if (!val[v].hasOwnProperty(vv)) continue
            //  module名称作为前缀，相当于命名空间
            path = key + '/' + vv
            actions[path] = this.wrapAction(val, val[v][vv])
          }
        }
        //  getters合并
        else if (v === 'getters') {
          for (let vv in val[v]) {
            if (!val[v].hasOwnProperty(vv)) continue
            //  module名称作为前缀，相当于命名空间
            path = key + '/' + vv
            getters[path] = this.wrapGetter(val, val[v][vv])
            //  运行getter函数，在观察者中修改getter的数据
            currentGetters[path] = () => {
              Ob.setData(this.getStoredObKey(path), getters[path]())
            }
          }
        }
        //  添加state描述符
        if (v === 'state') {
          for (let vv in val[v]) {
            if (!val[v].hasOwnProperty(vv)) continue
            Object.defineProperty(val[v], vv, {
              set (val) {
                STATE[key][vv] = val
                //  状态变更，通知页面
                //  更新当前对象中的所有getters
                for (let o in currentGetters) {
                  if (!currentGetters.hasOwnProperty(o)) continue
                  currentGetters[o]()
                }
              },
              get () {
                return STATE[key][vv]
              }
            })
          }
        }
      }
    }
    return {actions, getters}
  }

  /**
   * action高阶函数
   * @access private
   * @param {object} context 当前的module对象
   * @param {function} action 当前module中的action
   * @return {function(dispatch, rootState)}
   */
  wrapAction (context, action) {
    /**
     * dispatch和rootState由运行时确定
     */
    return (dispatch, rootState) => {
      //  绑定上下文
      (function () {
        //  调用当前module的commit
        const commit = (name, payload) => {
          this.commits[name](this.state, payload)
        }
        action({ commit, dispatch, rootState })
      }).call(context)
    }
  }

  /**
   * getter高阶函数
   * @access private
   * @param {object} context 当前的module对象
   * @param {function} getter 当前module中的getter
   * @return {function}
   */
  wrapGetter (context, getter) {
    return () => {
      return (function () {
        return getter(this.state)
      }.call(context))
    }
  }

  /**
   * 唯一状态键
   * @access private
   * @param key
   * @return {string}
   */
  getStoredObKey (key) {
    return 'Store/' + this.hid + '/' + key
  }
}

export default (config) => {
  if (CACHE_INST instanceof Store) return CACHE_INST
  CACHE_INST = new Store(config)
  return CACHE_INST
}