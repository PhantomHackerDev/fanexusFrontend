<template>
  <div class="moderation">
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
      navTabs: [
        {
          title: 'Signup keys',
          component: 'signup-keys'
        },
        {
          title: 'Moderation log',
          component: 'moderation-log'
        }
      ]
    };
  },
  methods: {
    navigateToTab(tabIndex) {
      this.$router.push({
        name: this.navTabs[tabIndex].component
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.moderation {
  grid-area: content;
  overflow: auto;
  padding: var(--element-padding-l);
}
</style>
