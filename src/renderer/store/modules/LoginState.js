const state = {
  logginState: false
}

const mutations = {
  CHANGE_STATE(state, payload) {
    state.logginState = payload
  }
}

const actions = {
  changeLogginState({ commit }, payload) {
    commit('CHANGE_STATE', payload)
  }
}

const getters = {
  logginState: state => state.logginState
}

export default {
  state,
  mutations,
  actions,
  getters
}
