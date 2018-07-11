//  答案接口
const state = {
  listData: [],
  detail: {}
}

const commits = {
  setAnswersListData (state, {data}) {
    state.listData = data
  },
  setAnswersDetail (state, {data}) {
    state.detail = data
  }
}

const getters = {
  GetAnswersListData (state) {
    return state.listData
  },
  GetAnswerDetail (state) {
    return state.detail
  }
}

const actions = {
  fetchAnswersListData ({commit, dispatch, rootState}, {type = 'GET', params = {}}) {
    dispatch('fetchMapWithToken', {
      name: 'answers.getList', type, params
    }).then((v) => {
      if (v.status === 1) {
        commit('setAnswersListData', {data: v.data.questions})
      }
    })
  },
  fetchAnswerDetail ({commit, dispatch, rootState}, {type = 'GET', params = {}}) {
    dispatch('fetchMapWithToken', {
      name: 'answers.detail', type, params
    }).then((v) => {
      if (v.status === 1) {
        commit('setAnswersDetail', {data: v.data})
      }
    })
  }
}

export default {
  state,
  commits,
  actions,
  getters
}
