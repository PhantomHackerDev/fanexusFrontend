const state = {
  images: [],
  currentImageSrc: ''
};

const getters = {
  currentImageIndex(state) {
    return state.images.findIndex(image => state.currentImageSrc === image);
  },
  previousImage(state, getters) {
    return state.images[getters.currentImageIndex - 1];
  },
  nextImage(state, getters) {
    return state.images[getters.currentImageIndex + 1];
  }
};

const actions = {
  openImageModal({ dispatch }, { images, src }) {
    dispatch('setImages', images);
    dispatch('setCurrentImage', src);
  },
  setImages({ commit }, images) {
    commit('setImages', images);
  },
  setCurrentImage({ commit }, src) {
    commit('setCurrentImage', src);
  },
  toNextImage({ dispatch, getters }) {
    getters.nextImage && dispatch('setCurrentImage', getters.nextImage);
  },
  toPreviousImage({ dispatch, getters }) {
    getters.previousImage && dispatch('setCurrentImage', getters.previousImage);
  },
  toNthImage({ state, dispatch }, n) {
    dispatch('setCurrentImage', state.images[n - 1]);
  }
};

const mutations = {
  setImages(state, images) {
    state.images = [...new Set(images.filter(images => images))];
  },
  setCurrentImage(state, src) {
    state.currentImageSrc = src;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
