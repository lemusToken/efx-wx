import Ob from '../../utils/efx/observer/ob.js'

const data = {
  // 初始化状态
  state: {
    test1: ''
  },
  // 与页面数据进行绑定
  getters: {
    getTest1(state) {
      return state.test1
    }
  },
  // 变更状态
  commits: {
    setTest1(state, payload) {
      state.test1 = payload.test
    }
  },
  // 页面发起动作 
  actions: {
    run1({ commit, dispatch, rootState }) {
      commit('setTest1', {
        test: 'haha'
      })
      // dispatch('test/run')
    },
    run3({ commit, dispatch }) {
      commit('setTest1', {
        test: 3
      })
    }
  }
}

export default data