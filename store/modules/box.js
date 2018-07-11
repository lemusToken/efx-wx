export default {
  // 初始化状态
  state: {
    open: false
  },
  // 与页面数据进行绑定
  getters: {
    getBoxState (state) {
      return state.open
    } 
  },
  // 变更状态
  commits: {
    setOpen (state, payload) {
      state.open = payload.open
    }
  },
  // 页面发起动作
  actions: {
    open ({commit}) {
      commit('setOpen', {open: true})
    }
  } 
}