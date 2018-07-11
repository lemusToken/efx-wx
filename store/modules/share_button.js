export default {
  // 初始化状态
  state: {
    shareEnable: false
  },
  // 与页面数据进行绑定
  getters: {
    getEnable (state) {
      return state.shareEnable
    } 
  },
  // 变更状态
  commits: {
    setEnable (state, payload) {
      state.shareEnable = payload.enable
    }
  },
  // 页面发起动作
  actions: {
    setShareEnable ({commit}) {
      commit('setEnable', {enable: true})
    }
  } 
}