<template>
  <div class="my-communities">
    <account-actions-header
      :nav-tabs="navTabs"
      :active-tab="activeTab"
      @select-tab="selectTab"
    />
    <component :is="activeComponent" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AccountActionsHeader from '~common/AccountActionsHeader';
import CurrentCommunities from '@/components/Activities/CurrentCommunities';
import Invites from '@/views/Invites';

export default {
  components: {
    AccountActionsHeader,
    CurrentCommunities,
    Invites
  },
  data() {
    return {
      activeTab: 0
    };
  },
  computed: {
    activeComponent() {
      return this.navTabs[this.activeTab].component;
    },
    navTabs() {
      return [
        {
          title: 'My communities',
          component: 'current-communities'
        },
        {
          title: `Community invites (${this.activeAlias.invitesCount})`,
          component: 'invites'
        }
      ];
    },
    ...mapGetters(['activeAlias'])
  },
  methods: {
    selectTab(tab) {
      this.activeTab = tab;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-communities {
  overflow-y: auto;
  grid-area: content;
}
</style>
