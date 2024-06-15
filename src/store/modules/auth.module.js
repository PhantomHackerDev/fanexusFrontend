import { setApiHeader } from '~api';
import {
  login,
  logout,
  logoutAll,
  createUser,
  updateUser,
  getCurrentUser
} from '@/services/auth.service';
import { hasToken, saveToken, destroyToken } from '@/services/jwt.service';
/*@TODO revise it, possibly get the user data from the getCurrentUser*/
import {
  getUserData,
  setUserData,
  removeUserData
} from '@/services/storage.service';
import socketConnection from '@/services/socket.service';
import router from '@/router/index';

const state = {
  userData: getUserData(),
  isAuthenticated: false,
  loginFailure: false,
  signupFailure: false,
  signupKey: null
};

const messageRemoveTime = 10000;

const actions = {
  async login({ commit }, payload) {
    try {
      const res = await login({
        ...payload,
        email: payload.email.toLowerCase()
      });
      commit('login', res);
      commit('updateAuth', res && res.userData);
    } catch (e) {
      clearTimeout(this.failureRemove);
      commit('setLoginFailure', true);
      this.failureRemove = setTimeout(
        () => commit('setLoginFailure', false),
        messageRemoveTime
      );
      throw e;
    }
  },

  async logout({ commit, dispatch }) {
    try {
      commit('logout');
      commit('updateAuth');
      commit('setLoggedIn', false);
      dispatch('setActiveAlias', 0, { root: true });
      await logout();
      if (router.currentRoute.meta.authentication) {
        router.push({ name: 'home' });
      }
    } catch (e) {
      return false;
    }
  },

  async logoutAll({ commit }) {
    try {
      await logoutAll();
      commit('logoutAll');
      commit('updateAuth');
    } catch (e) {
      return false;
    }
  },

  async createUser({ commit, dispatch, rootState }, payload) {
    try {
      await createUser({ ...payload, email: payload.email.toLowerCase() });
      await dispatch('login', payload);
      await dispatch('getUserAliases', undefined, { root: true });
      router.push({
        name: 'edit-blog',
        params: { name: rootState.alias.userAliases[0].Blog.id, id: 'id' }
      });
    } catch (e) {
      clearTimeout(this.failureRemove);
      commit('setSignupFailure', true);
      this.failureRemove = setTimeout(
        () => commit('setSignupFailure', false),
        messageRemoveTime
      );
      throw e;
    }
  },

  async updateUser({ commit }, payload) {
    commit('updateAuth', await updateUser(...payload));
  },

  async getCurrentUser() {
    try {
      await getCurrentUser();
    } catch (e) {
      return false;
    }
  },

  setLoggedIn({ commit }, value) {
    commit('setLoggedIn', value);
    if (value) {
      socketConnection.emit('add-session', state.userData.id);
    }
  },

  setSignupKey({ commit }, value) {
    commit('setSignupKey', value);
  },

  SOCKET_connect({ state }) {
    if (state.isAuthenticated) {
      socketConnection.emit('add-session', state.userData.id);
    }
  },

  SOCKET_disconnect({ state }) {
    if (state.isAuthenticated) {
      socketConnection.emit('remove-session', state.userData.id);
    }
  }
};

const mutations = {
  updateAuth(state, userData) {
    state.isAuthenticated = hasToken();
    userData ? setUserData(userData) : removeUserData();

    state.userData = getUserData();
    setApiHeader();
  },
  login(state, payload) {
    if (payload) {
      saveToken(payload.token);
      socketConnection.emit('add-session', payload.userData.id);
    }
  },
  logout(state) {
    socketConnection.emit('remove-session', state.userData.id);
    destroyToken();
  },
  logoutAll() {
    /*@TODO revise*/
    destroyToken();
  },
  setLoggedIn(state, value) {
    state.isAuthenticated = value;
  },
  setLoginFailure(state, value) {
    state.loginFailure = value;
  },
  setSignupKey(state, value) {
    state.signupKey = value;
  },
  setSignupFailure(state, value) {
    state.signupFailure = value;
  }
};

export default {
  state,
  actions,
  mutations
};
