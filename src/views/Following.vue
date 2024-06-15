<template>
  <div class="following">
    <await-response :has-response="loaded">
      <component
        :is="currentComponent"
        :data="data"
        button-type="follow"
        activity-name="Followed on"
        @remove-tag="unfollowTag"
      />
    </await-response>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  followingAreas,
  followingRoot,
  getFollowing
} from '@/services/following.service';
import { deleteFollow } from '@/services/follow.service';
import tabsMixin from '@/mixins/tabs.mixin';
import AccountActionsHeader from '~common/AccountActionsHeader';
import FollowingFollowing from '@/components/Following/FollowingFollowing';
import AwaitResponse from '~common/AwaitResponse';

export default {
  components: {
    AccountActionsHeader,
    FollowingFollowing,
    AwaitResponse
  },
  mixins: [tabsMixin],
  data() {
    return {
      data: { followTag: [], followBlog: [], followCommunity: [] },
      currentPage: 1,
      currentComponent: followingAreas.FollowingFollowing,
      activeTab: 0,
      selectSecondaryOptions: [],
      navTabs: [
        {
          title: 'Following',
          component: followingAreas.FollowingFollowing
        }
      ],
      /** @TODO make data dynamic */
      loaded: false
    };
  },
  computed: {
    followingComponents() {
      return getComponentsByPrefix.call(this, followingRoot);
    },
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    ...mapGetters(['activeAliasBlogId'])
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.followingComponents[componentIndex];
    },
    async getData() {
      this.data = await getFollowing(this.activeAliasId);
    },
    async unfollowTag(id) {
      await deleteFollow(id, 'tag');
      await this.getData();
      this.addToStat({ stat: 'followingCount', change: -1 });
    },
    ...mapActions(['addToStat'])
  },
  watch: {
    activeAliasId: {
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
.following {
  grid-area: content;
  overflow-y: auto;
}
</style>
