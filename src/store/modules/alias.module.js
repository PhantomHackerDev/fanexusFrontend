import {
  getUserAliases,
  setActiveAliasApi,
  getActiveAliasDataApi
} from '@/services/alias.service';
import {
  watchActivitiesCount,
  unwatchActivitiesCount
} from '@/services/activities.service';
import {
  getActiveAliasStorage,
  setActiveAliasStorage,
  removeActiveAliasStorage,
  setActivityCount,
  getWatchingActivities,
  setWatchingActivities
} from '@/services/storage.service';
import { isCancel } from 'axios';
import { getById } from '@/utils/array';

const watchRetryTime = 10000;

const state = {
  activeAliasStats: {},
  userAliases: [],
  activeAliasId: getActiveAliasStorage(),
  activeAliasData: null,
  canCreateNewAlias: null
};

const getters = {
  activeAlias(state) {
    return state.userAliases.find(alias => alias.id === state.activeAliasId);
  },
  activeAliasSrc(undefined, getters) {
    return getters.activeAlias && getters.activeAlias.avatar
      ? getters.activeAlias.avatar.src
      : '';
  },
  activeAliasBlog(undefined, getters) {
    return getters.activeAlias && getters.activeAlias.Blog;
  },
  activeAliasBlogUrl(undefined, getters) {
    return (
      getters.activeAliasBlog &&
      (getters.activeAliasBlog.link || getters.activeAliasBlog.id)
    );
  },
  activeAliasBlogId(undefined, getters) {
    return getters.activeAliasBlog && getters.activeAliasBlog.id;
  }
};

const actions = {
  async watchActiveAliasActivitiesCount({ dispatch, getters }, cancelToken) {
    try {
      if (JSON.parse(getWatchingActivities())) {
        setTimeout(
          () => dispatch('watchActiveAliasActivitiesCount', cancelToken),
          watchRetryTime
        );
      } else {
        setWatchingActivities(true);
        const activities = await watchActivitiesCount(cancelToken);
        if (activities.count) {
          getters.activeAlias.activitiesCount = activities.count;
          setActivityCount(activities.count);
        }
        setWatchingActivities(false);
        await dispatch('watchActiveAliasActivitiesCount', cancelToken);
      }
    } catch (e) {
      if (e.code !== 'ECONNABORTED' && !isCancel(e)) {
        await dispatch('watchActiveAliasActivitiesCount', cancelToken);
      }
    } finally {
      setWatchingActivities(false);
    }
  },
  async unwatchActiveAliasActivitiesCount() {
    await unwatchActivitiesCount();
  },
  resetActivitiesCount({ getters }) {
    getters.activeAlias.activitiesCount = 0;
    setActivityCount(0);
  },
  addToStat({ getters }, { stat, change }) {
    getters.activeAlias[stat] = Number(getters.activeAlias[stat]) + change;
  },
  async getUserAliases({ commit, state, dispatch }) {
    const { aliases, canCreateNewAlias } = await getUserAliases();
    commit('setUserAliases', aliases);
    commit('setCanCreateNewAlias', canCreateNewAlias);
    if (!state.activeAliasId) {
      dispatch('initActiveAlias');
    }
  },
  async initActiveAlias({ state, dispatch }) {
    await dispatch('setActiveAlias', state.userAliases[0].id);
  },
  async setActiveAlias({ commit, getters }, payload) {
    await setActiveAliasApi(payload);
    setActiveAliasStorage(payload);
    commit('setActiveAlias', payload);
    setActivityCount(getters.activeAlias.activitiesCount);
  },
  syncActiveAlias({ commit }, payload) {
    commit('setActiveAlias', payload);
  },
  removeActiveAlias({ commit }) {
    removeActiveAliasStorage();
    commit('removeActiveAlias');
  },
  clearUserAliases({ commit }) {
    commit('clearUserAliases');
  },
  async updateActiveAliasData({ commit, state }) {
    const newActiveAliasData = await getActiveAliasDataApi(state.activeAliasId);
    commit('setActiveAliasData', newActiveAliasData);
  },
  SOCKET_activity({ commit }, { aliasId, count }) {
    commit('updateActivity', { aliasId, count });
  }
};

const mutations = {
  setUserAliases(state, payload) {
    state.userAliases = payload;
  },
  setActiveAlias(state, payload) {
    state.activeAliasId = payload;
  },
  removeActiveAlias(state) {
    state.activeAliasId = null;
  },
  clearUserAliases(state) {
    state.userAliases = [];
  },
  setActiveAliasData(state, payload) {
    state.activeAliasData = payload;
  },
  setCanCreateNewAlias(state, value) {
    state.canCreateNewAlias = value;
  },
  updateActivity(state, { aliasId, count }) {
    getById(aliasId, state.userAliases).activitiesCount = count;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
