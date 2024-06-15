import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import { USER_ACTIVE_ALIAS, ACTIVITY_COUNT } from '@/services/storage.service';

Vue.use(Vuex);

const plugins = [
  ({ state: { imageViewer }, getters, dispatch, commit }) => {
    window.addEventListener('keydown', e => {
      if (imageViewer.currentImageSrc) {
        if (e.key === 'ArrowLeft') {
          dispatch('toPreviousImage');
        } else if (e.key === 'ArrowRight') {
          dispatch('toNextImage');
        } else if (e.key === 'Escape') {
          dispatch('setCurrentImage', null);
        }
      }
    });

    window.addEventListener('storage', event => {
      if (event.key === USER_ACTIVE_ALIAS) {
        commit('setActiveAlias', Number(event.newValue));
      } else if (event.key === ACTIVITY_COUNT) {
        getters.activeAlias.activitiesCount = Number(event.newValue);
      }
    });
  }
];

const store = new Vuex.Store({
  modules,
  plugins
});

store.dispatch('setTheme');

export default store;
