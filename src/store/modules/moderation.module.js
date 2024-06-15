const state = {
  id: null,
  type: null
};

const actions = {
  setModeratorDelete({ commit }, payload) {
    commit('setModeratorDelete', payload);
  }
};

const mutations = {
  setModeratorDelete(state, { id, type }) {
    state.id = id;
    state.type = type;
  }
};

export default {
  state,
  actions,
  mutations
};
