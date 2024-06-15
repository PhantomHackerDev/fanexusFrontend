<template>
  <div id="app">
    <component :is="layout" @back-to-top="scrollToTop">
      <router-view :key="`${routeKey}-${isAuthenticated}`" />
    </component>
    <vue-confirm-dialog></vue-confirm-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { LAYOUTS } from '@/services/layout.service';
import animateScrollTo from 'animated-scroll-to';

export default {
  computed: {
    layout() {
      const { meta = {} } = this.$route;
      const { DEFAULT } = LAYOUTS;

      return meta.layout || DEFAULT;
    },
    routeKey() {
      const { meta, params, fullPath } = this.$route;

      return meta.createPost || meta.showPost || meta.main
        ? `${meta.main || meta.page}-${params.tagNames ||
            params.name ||
            params.id}${params.order ? `-${params.order}` : ''}${
            params.id ? '-id' : ''
          }`
        : fullPath;
    },
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated
    }),
    isTablet() {
      return this.$store.getters['isTablet'];
    }
  },
  methods: {
    handleResize() {
      this.$store.commit('setWindowWidth', window.innerWidth);
    },
    scrollToTop() {
      animateScrollTo(0);
    }
  },
  created() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>
