export default {
  // 初始化状态
  state: {
    test: 1
  },
  // 与页面数据进行绑定
  getters: {
    getTest (state) {
      return state.test
    } 
  },
  // 变更状态
  commits: {
    setTest (state, payload) {
      state.test = payload.test
    }
  },
  // 页面发起动作
  // dispatch('run')
  actions: {
    run ({commit}) {
      commit('setTest', {test:'123123123'})
    }
  } 
}