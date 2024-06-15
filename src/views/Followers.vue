<template>
  <div class="followers">
    <await-response :has-response="loaded">
      <has-none :has-content="data.followedBy.length">
        <component :is="currentComponent" :data="data" />
      </has-none>
    </await-response>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  followersAreas,
  followersRoot,
  getFollowedBy
} from '@/services/followers.service';
import { followableTypes } from '@/services/following.service';
import tabsMixin from '@/mixins/tabs.mixin';
import AccountActionsHeader from '~common/AccountActionsHeader';
import FollowersFollowers from '@/components/Activities/FollowersFollowers';
import FollowersRequests from '@/components/Activities/FollowersRequests';
import AwaitResponse from '~common/AwaitResponse';
import HasNone from '~common/HasNone';

export default {
  components: {
    AccountActionsHeader,
    FollowersFollowers,
    FollowersRequests,
    AwaitResponse,
    HasNone
  },
  mixins: [tabsMixin],
  data() {
    return {
      data: { followedBy: [] },
      currentPage: 1,
      currentComponent: followersAreas.FollowersFollowers,
      activeTab: 0,
      selectSecondaryOptions: [],
      navTabs: [
        {
          title: 'Followers',
          component: followersAreas.FollowersFollowers
        },
        {
          // @TODO make data dynamic
          title: 'Requests',
          number: '32',
          component: followersAreas.FollowersRequests
        }
      ],
      // @TODO make data dynamic
      loaded: false
    };
  },
  computed: {
    followersComponents() {
      return getComponentsByPrefix.call(this, followersRoot);
    },
    ...mapGetters([
      'activeAliasBlog',
      'activeAliasBlogId',
      'activeAliasBlogUrl'
    ])
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.followersComponents[componentIndex];
    },
    async getData() {
      this.data = await getFollowedBy(
        this.activeAliasBlogUrl,
        followableTypes.blog,
        !this.activeAliasBlog.link
      );
    }
  },
  watch: {
    activeAliasBlogId: {
      async handler(val) {
        if (val) {
          await this.getData();
          this.loaded = true;
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.followers {
  overflow-y: auto;
  grid-area: content;
  padding: var(--element-padding-xl);
  @include mobile {
    padding-bottom: 50px;
  }
}
</style>
