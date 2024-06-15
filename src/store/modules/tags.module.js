const state = {
  list: [],
  showEditTagsModal: false,
  saveTagsMethod: () => {
    return undefined;
  }
};

const actions = {
  openEditTagsModal({ commit }, value = true) {
    commit('openEditTagsModal', value);
  },
  setTagsList({ commit }, list) {
    commit('setTagsList', list);
  },
  setSaveTagsMethod({ commit }, method) {
    commit('setSaveTagsMethod', method);
  }
};

const mutations = {
  openEditTagsModal(state, value) {
    state.showEditTagsModal = value;
  },
  setTagsList(state, list) {
    state.list = list;
  },
  setSaveTagsMethod(state, method) {
    state.saveTagsMethod = method;
  }
};

export default {
  state,
  actions,
  mutations
};
