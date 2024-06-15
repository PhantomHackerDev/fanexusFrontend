import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/scss/main.scss';
import { apiInit } from '~api';
import { LAYOUTS } from '@/services/layout.service';
import DefaultLayout from '@/layouts/Default';
import PureLayout from '@/layouts/Pure';
import './registerServiceWorker';
import VueSocketIO from 'vue-socket.io';
import socketConnection from '@/services/socket.service';
import { hasToken } from '@/services/jwt.service';
import VueConfirmDialog from 'vue-confirm-dialog';

Vue.use(VueRouter);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketConnection,
    vuex: {
      store,
      actionPrefix: 'SOCKET_'
    }
  })
);

Vue.use(VueConfirmDialog);

// layouts
const { DEFAULT, PURE } = LAYOUTS;

Vue.component(DEFAULT, DefaultLayout);
Vue.component(PURE, PureLayout);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);

apiInit();
Vue.config.productionTip = false;

(async () => {
  if (hasToken()) {
    try {
      await store.dispatch('getUserAliases');
      store.dispatch('setLoggedIn', true);
    } catch (e) {
      if (e.response.status === 401) {
        await store.dispatch('logout');
      }
    }
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
})();
