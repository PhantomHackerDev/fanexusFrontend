<template>
  <div class="blog" :style="{ '--header-height': headerHeight + 'px' }">
    <await-response :has-response="loaded">
      <wallpaper
        :src="data.coverImage ? data.coverImage.src : ''"
        @click.native.stop="setImagePreviewSrc(data.coverImage.src)"
      />
      <div class="blog-header">
        <avatar
          class="blog-header__avatar"
          size="xl"
          :file="data.avatar ? data.avatar.src : ''"
          @click.native.stop="setImagePreviewSrc(data.avatar.src)"
        />
        <tabs
          v-if="!isTablet"
          :tabs="navTabs"
          @select-tab="$active => setComponent($active, $active)"
          :active="activeTab"
          :additional-options="additionalOptions"
          @block="blockBlog"
          @unblock="unblockBlog"
        />
        <div v-else class="blog-header__info-block">
          <div class="blog-header__info-name">{{ data.name }}</div>
          <two-line-text
            v-if="!hideFromMinor"
            class="blog-header__info-description"
            :text="data.description"
            ref="infoDescription"
            @more-button-click="
              handleModalOpen(blogModalTypes.mobileDescriptionModal)
            "
          />
          <component
            v-if="isAuthenticated"
            :is="!data.aliasFollowing ? 'follow-icon' : 'unfollow-icon'"
            class="blog-header__info-follow-icon"
            @click="
              data.aliasFollowing ? unsubscribeFromBlog() : subscribeToBlog()
            "
          />
        </div>
      </div>
      <div v-if="isTablet" class="blog-mobile-controls">
        <tabs
          :tabs="navTabs"
          @select-tab="$active => setComponent($active, $active)"
          :additional-options="additionalMobileOptions"
          :active="activeTab"
          class="blog-mobile-tabs"
          @block="blockBlog"
          @unblock="unblockBlog"
          @follow="subscribeToBlog"
          @unfollow="unsubscribeFromBlog"
          @edit="editBlog"
        />
      </div>
      <div class="blog__blocked-notice" v-if="data.aliasBlocking">
        You have blocked this blog.
      </div>
      <div class="blog__not-found-notice" v-else-if="notFound">
        Blog not found.
      </div>
      <div class="blog-content" :class="layout" v-else>
        <div
          v-if="!(isTablet && activeTabObject.id === 'blogPostsTags')"
          class="blog-wrapper"
        >
          <sidebar-info
            v-if="data.id && !isTablet"
            :name="data.name"
            :feedType="feedTypes['blog']"
            :description="!hideFromMinor ? data.description : ''"
            :links="data.links"
            :tags="data.Tags"
            :isEditable="data.userHasEditPermissions"
            :isMember="data.aliasIsMember"
            :isSubscribe="data.aliasFollowing"
            @subscribe="subscribeToBlog"
            @unsubscribe="unsubscribeFromBlog"
            :await-follow="awaitFollow"
            @edit="editBlog"
            @select-tag="goToTaggedBlogs"
            :hide-from-minor="hideFromMinor"
          />
          <sidebar-display-options
            class="blog__display-options blog__sidebar-box"
            :exclude-reblog-option="true"
            @update-display="getData"
          />
          <template v-if="layout === 'one-sidebar'">
            <sidebar-select-order
              class="blog__select-order blog__sidebar-box"
              :selected="order"
            />
            <sidebar-tag-counts
              class="blog__tag-counts blog__sidebar-box"
              v-if="data.tagCounts && data.tagCounts.length && !isTablet"
              :tags="data.tagCounts"
              :current-tags="currentTags"
            />
          </template>
        </div>
        <div v-if="data.BlogPosts" class="blog-main" ref="contentArea">
          <keep-alive>
            <component
              :current-page="Number(currentPage)"
              @onPageChange="onPageChange"
              :blogPosts="data.BlogPosts"
              :count="data.count"
              :data="data"
              :is="currentComponent"
              :current-tags="currentTags"
              @openModal="handleModalOpen"
              @reportPost="handleReportPost($event)"
              :disabled="true"
            />
          </keep-alive>
        </div>
        <div
          v-if="layout === 'two-sidebars'"
          class="blog__sidebar-boxes-container"
        >
          <sidebar-select-order
            class="blog__select-order blog__sidebar-box"
            :selected="order"
          />
          <sidebar-tag-counts
            class="blog__tag-counts blog__sidebar-box"
            v-if="data.tagCounts && data.tagCounts.length"
            :tags="data.tagCounts"
            :current-tags="currentTags"
          />
        </div>
      </div>
      <!-- /*@TODO add close callback*/ -->
      <create-privacy-group-modal
        :settings="modalSettings[blogModalTypes.createPrivacyGroup]"
      />
      <mobile-description-modal
        :settings="modalSettings[blogModalTypes.mobileDescriptionModal]"
        :text="data.description"
      />
      <transition name="fade">
        <div v-if="isTablet && isTabletNameBarVisible" class="blog__name-bar">
          <div class="blog__name-bar-label text-overflow">{{ data.name }}</div>
          <component
            :is="!data.aliasFollowing ? 'follow-icon' : 'unfollow-icon'"
            class="blog__name-bar-icon-holder"
            @click="
              data.aliasFollowing ? unsubscribeFromBlog() : subscribeToBlog()
            "
          />
        </div>
      </transition>
    </await-response>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
/** @TODO add to a corresponding mixin */
import { feedTypes } from '@/services/feed.service';
import {
  createBlock,
  deleteBlock,
  createFollow,
  deleteFollow,
  followableTypes
} from '@/services/follow.service';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  blogRoot,
  blogModalTypes,
  blogAreas
} from '@/services/Blog/blog.service';
import settings from '@/services/Blog/blog.settings';
import Avatar from '~common/Avatar';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import contentSourceMixin from '@/mixins/content-source.mixin';
import SidebarInfo from '~common/SidebarInfo';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import SidebarDisplayOptions from '~common/SidebarDisplayOptions';
import CreatePrivacyGroupModal from '@/components/Blog/CreatePrivacyGroupModal';
import MobileDescriptionModal from '~common/MobileDescriptionModal';
// blogAreas
import BlogAllPosts from '@/components/Blog/BlogAllPosts';
import BlogMobileTags from '@/components/Blog/BlogMobileTags';
import Wallpaper from '~common/Wallpaper';
import AwaitResponse from '~common/AwaitResponse';
import TwoLineText from '~common/TwoLineText';
import paginationMixin from '@/mixins/pagination.mixin';
import FollowIcon from '~svg/follow.svg';
import UnfollowIcon from '~svg/unfollow.svg';

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
    },
    id: {
      type: String
    }
  },
  components: {
    CreatePrivacyGroupModal,
    MobileDescriptionModal,
    Avatar,
    Tabs,
    SidebarInfo,
    SidebarTagCounts,
    SidebarSelectOrder,
    SidebarDisplayOptions,
    // blogAreas (the order should be strict)
    BlogAllPosts,
    BlogMobileTags,
    Wallpaper,
    AwaitResponse,
    TwoLineText,
    FollowIcon,
    UnfollowIcon
  },
  mixins: [tabsMixin, contentSourceMixin, paginationMixin],
  data() {
    const context = this;
    return {
      feedTypes,
      activeTab: 0,
      currentComponent: null,
      settings,
      /*@TODO revise*/
      navTabs: [
        {
          title: 'All Posts',
          component: blogAreas.allPosts,
          get count() {
            return context.data.count;
          }
        }
      ],
      blogModalTypes,
      modalType: blogModalTypes.createPrivacyGroup,
      modalSettings: {
        [blogModalTypes.createPrivacyGroup]: {
          show: false,
          title: 'Create new privacy group',
          dismissText: 'Cancel',
          actionText: 'Save'
        },
        [blogModalTypes.mobileDescriptionModal]: {
          show: false,
          title: `Description`
        }
      },
      notFound: false,
      loaded: false,
      awaitFollow: false,
      isTabletNameBarVisible: false
    };
  },
  computed: {
    /** @TODO make it common between blog and community */

    blogComponents() {
      return getComponentsByPrefix.call(this, blogRoot);
    },
    currentTags() {
      return this.tagNames && JSON.parse(this.tagNames);
    },
    hideFromMinor() {
      return (
        (!this.activeAlias || this.activeAlias.isMinor) &&
        this.data.Alias &&
        !this.data.Alias.showMinors
      );
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
        if (this.data.userHasEditPermissions) {
          options.push({
            text: 'Edit',
            action: 'edit',
            special: false,
            toggleable: false
          });
        }
      }
      return [...(this.additionalOptions || []), ...options];
    },
    activeTabObject() {
      return this.navTabs[this.activeTab];
    }
  },
  methods: {
    ...mapActions([
      'getFeedData',
      'setImagePreviewSrc',
      'addToStat',
      'reloadFeed'
    ]),
    async getData() {
      try {
        await this.getFeedData({
          name: this.name,
          pagination: this.currentPage,
          type: feedTypes.blog,
          tagNames: this.tagNames,
          order: this.order,
          noReblogs: this.noReblogs,
          id: this.id
        });
        this.notFound = false;
      } catch (e) {
        if (e.response.status === 404) {
          this.notFound = true;
        } else {
          throw e;
        }
      }
    },
    handleModalOpen(modalType) {
      this.modalType = modalType;
      this.modalSettings[modalType].show = true;
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
      this.currentComponent = this.blogComponents[componentIndex];
    },
    async subscribeToBlog() {
      if (!this.awaitFollow) {
        this.awaitFollow = true;
        try {
          await createFollow(this.data.id, followableTypes.blog);
          this.addToStat({ stat: 'followingCount', change: 1 });
          await this.getData();
        } catch (e) {
          return false;
        }
        this.awaitFollow = false;
      }
    },
    async unsubscribeFromBlog() {
      if (!this.awaitFollow) {
        this.awaitFollow = true;
        try {
          await deleteFollow(this.data.id, followableTypes.blog);
          this.addToStat({ stat: 'followingCount', change: -1 });
          await this.getData();
        } catch (e) {
          return false;
        }
        this.awaitFollow = false;
      }
    },
    async blockBlog() {
      try {
        await createBlock(this.data.id, followableTypes.blog, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unblockBlog() {
      // Unused but may have future use, so keep it here.
      try {
        await deleteBlock(this.data.id, followableTypes.blog, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    editBlog() {
      this.$router.push({
        name: 'edit-blog',
        params: {
          name: this.data.link || this.data.id,
          id: this.data.link ? undefined : 'id'
        }
      });
    },
    goToTaggedBlogs(tagName) {
      this.$router.push({
        name: 'tagged-blogs',
        params: { tagNames: JSON.stringify([tagName]) }
      });
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
    },
    isTablet: {
      immediate: true,
      handler(isTablet) {
        if (isTablet) {
          this.navTabs.push({
            id: 'blogPostsTags',
            title: 'Tags',
            component: blogAreas.allPosts
          });
        } else {
          const index = this.navTabs.findIndex(
            tab => tab.id === 'blogPostsTags'
          );
          if (index !== -1) {
            this.navTabs.splice(index, 1);
          }
        }
      }
    },
    'data.description'() {
      if (this.isTablet && this.$refs.infoDescription) {
        this.$refs.infoDescription.updateParams();
      }
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
.blog {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding-bottom: var(--element-padding-l);
  @include mobile {
    padding-bottom: 40px;
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
      display: flex;
      position: relative;
      background-color: initial;
      padding: 0;
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
        position: relative;
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
  &-content {
    padding: 0 var(--element-padding-xl);
    display: grid;
    grid-column-gap: var(--element-margin-xl);
    @include tablet {
      display: flex;
      flex-direction: column;
    }
    &.one-sidebar {
      grid-template-columns: var(--width-medium-small) minmax(0, auto);
    }
    &.two-sidebars {
      grid-template-columns:
        var(--width-medium-small) minmax(0, auto)
        var(--width-small);
    }
  }
  &-mobile-controls {
    @include tablet {
      margin: 0 var(--element-padding-xl);
      padding: 0 var(--element-padding-s);
      background-color: var(--BG-blog-post);
    }
  }
  &-mobile-tabs {
    @include tablet {
      width: 200px;
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
      padding: var(--element-padding-l) 0;
      order: 5;
    }
  }
  &__sidebar-boxes-container {
    @include tablet {
      display: flex;
      justify-content: space-between;
    }
  }
  &__sidebar-box:not(:first-child) {
    margin-top: var(--element-margin-s);
    @include tablet {
      margin-top: 0;
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
