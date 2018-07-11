//  问题接口
const state = {
  listData: []
}

const commits = {
  setQuestionsListData (state, {data}) {
    state.listData = data
  }
}

const getters = {
  GetQuestionsListData (state) {
    return state.listData
  }
}

const actions = {
  fetchQuestionsListData ({commit, dispatch, rootState}, {type = 'GET', params = {}}) {
    dispatch('fetchMapWithToken', {
      name: 'questions.getList', type, params
    }).then((v) => {
      if (v.status === 1) {
        commit('setQuestionsListData', {data: v.data.questions})
      }
    })
  },
  fetchQuestionAdd ({commit, dispatch, rootState}, {params = {}}) {
    return dispatch('fetchMapWithToken', {
      name: 'questions.add',
      type: 'POST',
      params
    })
  }
}

export default {
  state,
  commits,
  actions,
  getters
}
