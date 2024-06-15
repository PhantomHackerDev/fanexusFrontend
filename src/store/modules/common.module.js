import cssVars from '../../assets/scss/common/_mixins.scss';

const pxValueToNumber = value => Number(value.replace('px', ''));

const state = {
  windowWidth: null,
  headerHeight: null
};

const getters = {
  isTablet(state) {
    return state.windowWidth <= pxValueToNumber(cssVars.tablet);
  },
  isMobile(state) {
    return state.windowWidth <= pxValueToNumber(cssVars.mobile);
  },
  maxColumnsCount(state, getters) {
    if (getters.isMobile) {
      return 1;
    }
    if (getters.isTablet) {
      return 3;
    }
    return 5;
  }
};

const actions = {};

const mutations = {
  setWindowWidth(state, value) {
    state.windowWidth = value;
  },
  setHeaderHeight(state, value) {
    state.headerHeight = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
