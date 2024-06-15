const localStorageTheme = JSON.parse(localStorage.getItem('themeDark'));

const state = {
  themeDark: localStorageTheme === null ? true : localStorageTheme
};

const actions = {
  setTheme({ commit }, payload) {
    commit('setTheme', payload);
  }
};

const mutations = {
  setTheme(state, payload) {
    const htmlElement = document.documentElement;

    if (state.themeDark && payload === undefined) {
      return htmlElement.classList.add('theme-dark');
    } else {
      if (payload) {
        htmlElement.classList.add('theme-dark');
        localStorage.setItem('themeDark', true);
      } else {
        htmlElement.classList.remove('theme-dark');
        localStorage.setItem('themeDark', false);
      }
    }

    state.themeDark = !!payload;
  }
};

export default {
  state,
  actions,
  mutations
};
