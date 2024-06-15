import { getActivities } from '@/services/activities.service';
import { deleteItemById } from '@/utils/array.js';

const state = {
  list: [],
  flashMessages: [],
  messageCounter: 0
};

const messageRemoveTime = 10000;

const actions = {
  async getActivitiesData({ commit }) {
    commit('setActivitiesData', await getActivities());
  },
  async addFlashMessage({ commit }, message) {
    commit('addFlashMessage', message);
  }
};

const mutations = {
  setActivitiesData(state, payload) {
    state.list = payload;
  },
  addFlashMessage(state, { message, link, linkText, type }) {
    const id = state.messageCounter++;
    state.flashMessages.push({
      message,
      id,
      link,
      linkText,
      type
    });
    setTimeout(() => {
      deleteItemById(id, state.flashMessages);
    }, messageRemoveTime);
  }
};

export default {
  state,
  actions,
  mutations
};
