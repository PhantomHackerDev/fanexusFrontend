import {
  getPrivacyGroup,
  getPrivacyGroups,
  createPrivacyGroup,
  updatePrivacyGroup,
  removePrivacyGroup,
  addAliasesToPrivacyGroup,
  removeAliasesFromPrivacyGroup,
  addPrivacyGroupToPrivacyGroup,
  removePrivacyGroupFromPrivacyGroup
} from '@/services/privacy-group.service';

import { getById, deleteItemById } from '@/utils/array.js';

const state = {
  list: []
};

const getters = {
  defaultPrivacyGroups(state) {
    return state.list.filter(({ isDefault }) => isDefault);
  }
};

const actions = {
  async setPrivacyGroups({ commit }) {
    try {
      const privacyGroups = (await getPrivacyGroups()).map(privacyGroup => ({
        ...privacyGroup,
        aliases: [],
        subsets: [],
        loaded: false,
        async loadData() {
          const data = await getPrivacyGroup(this.id);
          this.aliases = data.Aliases;
          this.subsets = data.containsAccessControlGroups.map(subset =>
            getById(subset.id, privacyGroups)
          );
        }
      }));
      commit('setPrivacyGroups', privacyGroups);
    } catch (e) {
      commit('setPrivacyGroups', []);
    }
  },
  async createPrivacyGroup({ commit, rootState }) {
    const newPrivacyGroup = {
      ...(await createPrivacyGroup({
        name: 'new privacy group',
        isDefault: false,
        accessControlSetting: 1,
        belongsToAliasId: rootState.alias.activeAliasId
      })),
      aliases: [],
      subsets: [],
      loaded: true
    };
    commit('addPrivacyGroup', newPrivacyGroup);
    return newPrivacyGroup;
  },
  async updatePrivacyGroup({ commit }, { privacyGroup, params }) {
    const payload = [privacyGroup.id, params];
    clearTimeout(this.timeout);
    const timeoutDelay = 1000;
    this.timeout = setTimeout(
      async () => await updatePrivacyGroup(...payload),
      timeoutDelay
    );
    commit('updatePrivacyGroup', { privacyGroup, params });
  },
  async deletePrivacyGroup({ commit }, { id, index }) {
    await removePrivacyGroup(id);
    commit('removePrivacyGroup', index);
  },
  async addMember({ commit }, { privacyGroup, alias }) {
    const payload = [privacyGroup.id, { aliases: [alias.id] }];
    await addAliasesToPrivacyGroup(...payload);
    commit('addMember', { privacyGroup, alias });
  },
  async removeMember({ commit }, { privacyGroup, alias }) {
    const payload = [privacyGroup.id, { aliases: [alias.id] }];
    await removeAliasesFromPrivacyGroup(...payload);
    commit('removeMember', { privacyGroup, alias });
  },
  async addSubset({ commit }, { privacyGroup, subset }) {
    await addPrivacyGroupToPrivacyGroup(privacyGroup.id, {
      addAccessControlIds: [subset.id]
    });
    commit('addSubset', { privacyGroup, subset });
  },
  async removeSubset({ commit }, { privacyGroup, subset }) {
    await removePrivacyGroupFromPrivacyGroup(privacyGroup.id, {
      removeAccessControlIds: [subset.id]
    });
    commit('removeSubset', { privacyGroup, subset });
  }
};

const mutations = {
  setPrivacyGroups(state, privacyGroups) {
    state.list = privacyGroups;
  },
  addPrivacyGroup(state, privacyGroup) {
    state.list.push(privacyGroup);
  },
  updatePrivacyGroup(state, { privacyGroup, params }) {
    Object.assign(privacyGroup, params);
  },
  removePrivacyGroup(state, index) {
    state.list.splice(index, 1);
  },
  addMember(state, { privacyGroup, alias }) {
    privacyGroup.aliases.push(alias);
  },
  removeMember(state, { privacyGroup, alias }) {
    deleteItemById(alias.id, privacyGroup.aliases);
  },
  addSubset(state, { privacyGroup, subset }) {
    privacyGroup.subsets.push(subset);
  },
  removeSubset(state, { privacyGroup, subset }) {
    privacyGroup.subsets.splice(privacyGroup.subsets.indexOf(subset), 1);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
