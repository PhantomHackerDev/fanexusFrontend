const state = {
  confirming: false,
  message: '',
  action: null
};

const actions = {
  setAction({ commit }, { message, action }) {
    commit('setMessage', message);
    commit('setAction', action);
    commit('setConfirming', true);
  },
  confirmAction({ state }) {
    return state.action();
  },
  cancelAction({ commit }) {
    commit('setConfirming', false);
  }
};

const mutations = {
  setMessage(state, message) {
    state.message = message;
  },
  setAction(state, action) {
    state.action = action;
  },
  setConfirming(state, value) {
    state.confirming = value;
  }
};

export default {
  state,
  actions,
  mutations
};
