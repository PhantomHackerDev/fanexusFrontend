<template>
  <div class="likes">
    <tabs :tabs="navTabs" @select-tab="navigateToTab" :active="tabIndex" />
    <router-view :key="`${activeAliasId}-${tabIndex}`" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';

export default {
  components: {
    Tabs
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    tabIndex() {
      return this.$route.meta.tabIndex;
    }
  },
  mixins: [tabsMixin],
  data() {
    return {
      loaded: false,
      navTabs: [
        {
          title: 'Blog posts'
        },
        {
          title: 'Comments'
        }
      ]
    };
  },
  methods: {
    navigateToTab(tabIndex) {
      if (tabIndex !== this.tabIndex) {
        this.$router.push({
          name: ['likes', 'likes-comments'][tabIndex],
          params: this.$route.params
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.likes {
  grid-area: content;
  overflow: auto;
  padding: var(--element-padding-l);
  @include mobile {
    padding-bottom: 50px;
  }
}
</style>
