<template>
  <div class="community" :style="{ '--header-height': headerHeight + 'px' }">
    <await-response :has-response="loaded">
      <!-- @TODO revise it -->
      <wallpaper
        :src="data.coverImage ? data.coverImage.src : ''"
        @click.native.stop="setImagePreviewSrc(data.coverImage.src)"
      />
      <div class="community-header">
        <avatar
          class="community-header__avatar"
          size="xl"
          :file="data.avatar ? data.avatar.src : defaultAvatar"
          @click.native.stop="setImagePreviewSrc(data.avatar.src)"
        />
        <tabs
          v-if="!isTablet"
          :tabs="navTabs"
          @select-tab="$active => setComponent($active, $active)"
          :active="activeTab"
          :additional-options="additionalOptions"
          @block="blockCommunity"
          @unblock="unblockCommunity"
        />
        <div v-else class="community-header__info-block">
          <div class="community-header__info-name">{{ data.name }}</div>
          <two-line-text
            class="community-header__info-description"
            :text="data.description"
            ref="infoDescription"
            @more-button-click="mobileDescriptionModal.show = true"
          />
          <follow-icon
            v-if="isAuthenticated"
            class="community-header__info-follow-icon"
            @click="mobileFollowModal.show = true"
          />
        </div>
      </div>
      <div v-if="isTablet" class="community-mobile-controls">
        <tabs
          :tabs="mobileNavTabs"
          @select-tab="$active => setComponent($active, $active)"
          :additional-options="additionalMobileOptions"
          :active="activeTab"
          class="community-mobile-tabs"
          @block="blockCommunity"
          @unblock="unblockCommunity"
          @follow="subscribeToCommunity"
          @unfollow="unsubscribeFromCommunity"
          @edit="editCommunity"
          @join="enterCommunity"
          @leave="leaveCommunity"
        />
      </div>
      <div class="community__blocked-notice" v-if="data.aliasBlocking">
        You have blocked this community.
      </div>
      <div class="community__not-found-notice" v-else-if="notFound">
        Community not found.
      </div>
      <div class="community-content" :class="layout" v-else>
        <div
          v-if="
            !(isTablet && activeMobileTabObject.id === 'communityPostsTags')
          "
          class="community-wrapper"
        >
          <sidebar-info
            v-if="data.name && !isTablet"
            :name="data.name"
            :feedType="feedTypes['community']"
            :description="data.description"
            :links="data.links"
            :tags="data.Tags"
            :isEditable="data.userHasEditPermissions"
            :isMember="data.aliasIsMember"
            :membershipPending="data.membershipPending"
            :isSubscribe="data.aliasFollowing"
            subtitle="Community links"
            @join="enterCommunity"
            @leave="leaveCommunity"
            @subscribe="subscribeToCommunity"
            @unsubscribe="unsubscribeFromCommunity"
            :await-follow="awaitFollow"
            @edit="editCommunity"
            @select-tag="goToTaggedCommunities"
          />
          <sidebar-display-options
            class="community__display-options community__sidebar-box"
            :exclude-reblog-option="true"
            @update-display="getData"
          />
          <template v-if="layout === 'one-sidebar'">
            <sidebar-select-order
              class="community__select-order community__sidebar-box"
              :selected="order"
            />
            <sidebar-tag-counts
              class="community__tag-counts community__sidebar-box"
              v-if="data.tagCounts && data.tagCounts.length && !isTablet"
              :tags="data.tagCounts"
              :current-tags="currentTags"
            />
          </template>
        </div>
        <div v-if="data.BlogPosts" class="community-main" ref="contentArea">
          <div
            v-if="!Number(data.moderatorCount) && data.aliasIsMember"
            class="community__step-up"
          >
            This community has no moderators.<form-button
              @click.native.stop="becomeModerator"
              type="submit"
              text="Step up"
              class="community__step-up-button"
            />
          </div>
          <component
            v-if="data && data.id"
            :current-page="Number(currentPage)"
            :is="currentComponent"
            :data="data"
            :rules="data.communityRules"
            :settings="settings"
            :communityId="data.id"
            :blogPosts="data.BlogPosts"
            :count="data.count"
            :disabled="true"
            @onPageChange="onPageChange"
            @openModal="handleModalOpen"
            @reportPost="handleReportPost($event)"
            @removed-self="getData"
          />
        </div>
        <div v-if="layout === 'two-sidebars'">
          <sidebar-select-order
            class="community__select-order community__sidebar-box"
            :selected="order"
          />
          <sidebar-tag-counts
            class="community__tag-counts community__sidebar-box"
            v-if="data.tagCounts && data.tagCounts.length"
            :tags="data.tagCounts"
            :current-tags="currentTags"
          />
        </div>
      </div>
      <moderation-request-modal
        :settings="moderationModalSettings"
        :data="moderationModalData"
      />
      <mobile-description-modal
        :settings="mobileDescriptionModal"
        :text="data.description"
      />
      <members-modal
        v-if="modalSettings.show"
        :settings="modalSettings"
        :communityId="data.id"
      />
      <mobile-follow-modal
        :settings="mobileFollowModal"
        :isMember="data.aliasIsMember"
        :membershipPending="data.membershipPending"
        :isSubscribe="data.aliasFollowing"
        @join="enterCommunity"
        @leave="leaveCommunity"
        @subscribe="subscribeToCommunity"
        @unsubscribe="unsubscribeFromCommunity"
        :await-follow="awaitFollow"
      />
      <transition name="fade">
        <div
          v-if="isTablet && isTabletNameBarVisible"
          class="community__name-bar"
        >
          <div class="community__name-bar-label text-overflow">
            {{ data.name }}
          </div>
          <follow-icon
            class="community__name-bar-icon-holder"
            @click="mobileFollowModal.show = true"
          />
        </div>
      </transition>
    </await-response>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
/** @TODO add to a corresponding mixin */
import { feedTypes } from '@/services/feed.service';
import {
  joinCommunity,
  removeMemberFromCommunity,
  addModerators
} from '@/services/Community/community.service';
import {
  createFollow,
  deleteFollow,
  createBlock,
  deleteBlock,
  followableTypes
} from '@/services/follow.service';
import navTabs from '@/services/Community/community.navTabs';
import settings from '@/services/Community/community.settings';
import moderationModalData from '@/services/Community/community.moderationModalData';
import { defaultAvatar } from '@/services/image.service';
import MembersModal from '@/components/Community/MembersModal';
import Avatar from '~common/Avatar';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import contentSourceMixin from '@/mixins/content-source.mixin';
import SidebarInfo from '~common/SidebarInfo';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import SidebarDisplayOptions from '~common/SidebarDisplayOptions';
import Wallpaper from '~common/Wallpaper';
import FormButton from '~common/Buttons/FormButton';
import BlogSettings from '@/components/Blog/BlogSettings';
import ModerationRequestModal from '@/components/Community/ModerationRequestModal';
import MobileDescriptionModal from '~common/MobileDescriptionModal';
import CommunityAllPosts from '@/components/Community/CommunityAllPosts';
import CommunityMembers from '@/components/Community/CommunityMembers';
import CommunityModerators from '@/components/Community/CommunityModerators';
import CommunityRules from '@/components/Community/CommunityRules';
import CommunityRequests from '@/components/Community/CommunityRequests';
import CommunityCreateRules from '@/components/Community/CommunityCreateRules';
import CommunitySettings from '../components/Community/CommunitySettings';
import CommunityMobileTags from '../components/Community/CommunityMobileTags';
import MobileFollowModal from '../components/Community/MobileFollowModal';
import AwaitResponse from '~common/AwaitResponse';
import TwoLineText from '~common/TwoLineText';
import paginationMixin from '@/mixins/pagination.mixin';
import FollowIcon from '~svg/follow.svg';

export default {
  props: {
    name: {
      required: true,
      type: [Number, String]
    },
    tagNames: {
      type: String
    },
    order: {
      type: String
    }
  },
  components: {
    ModerationRequestModal,
    MobileDescriptionModal,
    Avatar,
    Tabs,
    SidebarTagCounts,
    SidebarSelectOrder,
    SidebarDisplayOptions,
    BlogSettings,
    SidebarInfo,
    Wallpaper,
    FormButton,
    MembersModal,
    // communityAreas (the order should be strict)
    CommunityAllPosts,
    CommunityRules,
    CommunityMembers,
    CommunityModerators,
    CommunityRequests,
    CommunitySettings,
    CommunityCreateRules,
    CommunityMobileTags,
    MobileFollowModal,
    AwaitResponse,
    TwoLineText,
    FollowIcon
  },
  mixins: [tabsMixin, paginationMixin, contentSourceMixin],
  data() {
    const context = this;
    return {
      activeTab: 0,
      currentComponent: null,
      settings,
      // @TODO we need to implement selectOptions in settings flow
      get navTabs() {
        return (
          context.data &&
          navTabs({ blogPostCount: context.data.count, ...context.data })
        );
      },
      moderationModalSettings: {
        show: false,
        title: 'Moderation request',
        dismissText: 'Decline',
        actionText: 'Accept'
      },
      modalSettings: {
        show: false,
        title: 'Invite members to ',
        dismissText: 'Cancel',
        actionText: '+ Add',
        data: []
      },
      mobileDescriptionModal: {
        show: false,
        title: `Description`
      },
      mobileFollowModal: {
        show: false,
        title: 'Settings'
      },
      feedTypes,
      /** @TODO change to real data and remove 'src\services\Community\community.moderationModalData.js' */
      moderationModalData,
      defaultAvatar,
      notFound: false,
      loaded: false,
      awaitFollow: false,
      isTabletNameBarVisible: false
    };
  },
  computed: {
    currentTags() {
      return this.tagNames && JSON.parse(this.tagNames);
    },
    ...mapState({
      noReblogs: state => state.feed.display.showReblogs === 'hide',
      headerHeight: state => state.common.headerHeight,
      isAuthenticated: state => state.auth.isAuthenticated
    }),
    ...mapGetters(['layout', 'isTablet']),
    additionalMobileOptions() {
      const options = [];
      if (this.isTablet && this.isAuthenticated) {
        options.push({
          text: this.data.aliasFollowing ? 'Unfollow' : 'Follow',
          action: this.data.aliasFollowing ? 'unfollow' : 'follow',
          special: false,
          toggleable: false
        });
        options.push({
          text: this.data.aliasIsMember ? 'Leave' : 'Join',
          action: this.data.aliasIsMember ? 'leave' : 'join',
          special: false,
          toggleable: false
        });
        if (this.data.userHasEditPermissions) {
          options.push({
            text: 'Edit',
            action: 'edit',
            special: false,
            toggleable: false
          });
        }
      }
      if (this.additionalOptions) {
        return [...this.additionalOptions, ...options];
      }
      return options;
    },
    mobileNavTabs() {
      const tabs = this.navTabs.map(tab => {
        if (tab.title === 'Moderators') {
          tab.title = 'Mods';
        } else if (tab.title === 'Requests') {
          tab.title = 'Reqs';
        }
        return tab;
      });
      return [
        ...tabs,
        {
          id: 'communityPostsTags',
          title: 'Tags',
          component: CommunityMobileTags
        }
      ];
    },
    activeMobileTabObject() {
      return this.mobileNavTabs[this.activeTab];
    }
  },
  methods: {
    ...mapActions([
      'getFeedData',
      'sortRules',
      'setImagePreviewSrc',
      'addToStat',
      'reloadFeed',
      'setAction'
    ]),
    async getData() {
      try {
        await this.getFeedData({
          name: this.name,
          pagination: this.currentPage,
          type: feedTypes.community,
          tagNames: this.tagNames,
          order: this.order,
          noReblogs: this.noReblogs
        });
        this.sortRules();
        this.modalSettings.title += this.data.name;
        this.notFound = false;
      } catch (e) {
        if (e.response.status === 404) {
          this.notFound = true;
        } else {
          throw e;
        }
      }
    },
    async enterCommunity() {
      const payload = {
        alias: this.activeAliasId
      };
      try {
        await joinCommunity(this.data.id, payload);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async leaveCommunity() {
      if (this.data.requireApproval) {
        this.setAction({
          message: 'This community requires approval to rejoin. Are you sure?',
          action: async () => {
            await this.sendLeaveCommunityRequest();
          }
        });
      } else {
        await this.sendLeaveCommunityRequest();
      }
    },
    async sendLeaveCommunityRequest(aliasIdToRemove = this.activeAliasId) {
      const payload = {
        alias: this.activeAliasId,
        removeMemberId: aliasIdToRemove
      };
      try {
        await removeMemberFromCommunity(this.data.id, payload);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async subscribeToCommunity() {
      if (!this.awaitFollow) {
        this.awaitFollow = true;
        try {
          await createFollow(this.data.id, followableTypes.community);
          this.addToStat({ stat: 'followingCount', change: 1 });
          await this.getData();
        } catch (e) {
          return false;
        }
        this.awaitFollow = false;
      }
    },
    async unsubscribeFromCommunity() {
      if (!this.awaitFollow) {
        this.awaitFollow = true;
        try {
          await deleteFollow(this.data.id, followableTypes.community);
          this.addToStat({ stat: 'followingCount', change: -1 });
          await this.getData();
        } catch (e) {
          return false;
        }
        this.awaitFollow = false;
      }
    },
    async blockCommunity() {
      try {
        await createBlock(this.data.id, followableTypes.community, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unblockCommunity() {
      try {
        await deleteBlock(this.data.id, followableTypes.community, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async editCommunity() {
      await this.$router.push({
        name: 'edit-community',
        params: { id: this.data.link }
      });
    },
    handleModalOpen() {
      this.modalSettings.show = true;
    },
    handleReportPost(blogPost) {
      this.$parent.$parent.handleOpenSubmitReportModal({
        isBlogPost: true,
        postId: blogPost.id,
        commentId: null,
        postingAlias: blogPost.Alias.name,
        updatedAt: blogPost.updatedAt
      });
    },
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      const tabs = !this.isTablet ? this.navTabs : this.mobileNavTabs;
      this.currentComponent = tabs[componentIndex].component;
    },
    goToTaggedCommunities(tagName) {
      this.$router.push({
        name: 'tagged-communities',
        params: { tagNames: JSON.stringify([tagName]) }
      });
    },
    async becomeModerator() {
      const payload = {
        alias: this.activeAliasId,
        moderators: [this.activeAliasId]
      };
      await addModerators(this.data.id, payload);
      await this.getData();
    },
    handleScroll() {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.offsetHeight - window.innerHeight;
      if (scrollTop + 10 > scrollHeight) {
        this.isTabletNameBarVisible = true;
        return;
      }
      const minScrollToShow = 150;
      this.isTabletNameBarVisible =
        scrollTop > minScrollToShow && scrollTop > this._previousScrollTopValue;
      this._previousScrollTopValue = scrollTop;
    }
  },
  watch: {
    activeAliasId() {
      return this.reloadFeed();
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  async mounted() {
    await this.getData();
    this.isTabletNameBarVisible = false;
    this.setComponent();
    this.loaded = true;
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.community {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding-bottom: var(--element-padding-l);

  ::v-deep &-tabs .nav-tabs li button {
    font-size: var(--size-button);
    text-transform: uppercase;
  }
  &-header {
    display: grid;
    align-items: end;
    grid-template-rows: minmax(0, 60px);
    grid-template-columns:
      var(--width-medium-small)
      max-content var(--width-small);
    grid-gap: var(--element-margin-xl);
    background-color: var(--BG-blog-post);
    padding: 0 var(--element-padding-xl);
    margin-bottom: var(--element-margin-xl);
    @include tablet {
      padding: 0;
      display: flex;
      position: relative;
      background-color: initial;
    }
    img {
      border: var(--border-width-avatar) solid var(--color-white);
      @include tablet {
        position: absolute;
        top: -30px;
      }
    }
    &__info-block {
      @include tablet {
        padding: 12px 60px 10px calc(var(--width-medium-small) + 20px);
        width: 100%;
      }
    }
    &__info-name {
      @include tablet {
        font-size: 18px;
        color: var(--text-primary);
      }
    }
    &__info-description {
      @include tablet {
        font-size: 12px;
        color: var(--text-primary);
        margin-top: 10px;
      }
    }
    &__info-follow-icon {
      @include tablet {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 20px;
        fill: var(--text-primary);
      }
    }
  }
  &-mobile-controls {
    @include tablet {
      padding: 0 var(--element-padding-s);
    }
    @include mobile-m {
      ::v-deep .nav-tabs li > button {
        font-size: 10px;
      }
    }
  }
  &-content {
    padding: 0 var(--element-padding-xl);
    display: grid;
    grid-gap: var(--element-padding-xl);
    @include tablet {
      display: flex;
      flex-direction: column;
      grid-gap: var(--element-margin-s);
      padding-bottom: 50px;
    }
    &.one-sidebar {
      grid-template-columns:
        var(--width-medium-small)
        minmax(0, auto);
    }
    &.two-sidebars {
      grid-template-columns:
        var(--width-medium-small)
        minmax(0, auto) var(--width-small);
    }
  }
  &-wrapper {
    @include tablet {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
  }
  &-main {
    padding: var(--element-padding-l);
    @include tablet {
      padding: 0;
      order: 5;
    }
  }
  &__sidebar-box:not(:first-child) {
    margin-top: var(--element-margin-s);
    @include tablet {
      margin-top: 0;
    }
  }
  &__step-up {
    color: var(--text-primary);
    text-align: center;
    margin-bottom: var(--element-margin-m);
    padding: var(--element-padding-m);
    background-color: var(--BG-blog-post);

    &-button {
      margin-left: var(--element-margin-xl);
    }
  }

  &__blocked-notice,
  &__not-found-notice {
    text-align: center;
    color: var(--text-primary);
  }
  &__name-bar {
    top: var(--header-height);
    left: 0;
    position: fixed;
    width: 100%;
    padding: var(--element-padding-s);
    background-color: var(--color-main-600);
    display: flex;
    justify-content: space-between;
  }
  &__name-bar-label {
    color: var(--color-white);
    width: 100%;
    padding-right: 10px;
  }
  &__name-bar-icon-holder {
    position: relative;
    width: 24px;
    height: 20px;
    flex-shrink: 0;
    fill: var(--color-white);

    path {
      width: 100%;
      height: 100%;
    }
  }

  &__display-options {
    @include tablet {
      width: 68%;
      padding: var(--element-padding-m);

      ::v-deep {
        .options-rows {
          display: flex;
          justify-content: center;
        }

        .options-rows__row {
          &:not(:first-child) {
            margin-left: var(--element-margin-l);
          }
        }

        .options-rows__value-list {
          margin-bottom: 0;
        }
      }
    }

    @include mobile {
      padding: var(--element-padding-s);
      ::v-deep {
        .options-rows {
          justify-content: flex-start;
        }
      }
    }
  }

  &__select-order {
    @include tablet {
      width: 30%;
    }

    @include mobile {
      width: 50%;
    }
  }
}
</style>
