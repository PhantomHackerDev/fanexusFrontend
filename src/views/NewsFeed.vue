<template>
  <div
    class="feed pinterest"
    :style="{ '--header-height': headerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <await-response :has-response="loaded" :class="{ 'feed-content': loaded }">
      <div
        class="feed-news "
        :class="layout"
        :style="{ '--columns-number': currentColumns }"
      >
        <!-- use @openModal="openBlogModal" from vuex -->
        <div
          class="feed-wrapper"
          :class="{ 'feed-wrapper_transparent': isMobileOptionsTransparent }"
        >
          <sidebar-display-options
            class="feed__display-options feed__sidebar-box"
            :exclude-reblog-option="true"
            @update-display="getData"
          />
          <template v-if="layout === 'one-sidebar'">
            <sidebar-select-order
              class="feed__select-order feed__sidebar-box"
              :selected="order"
              :on-news-feed="true"
            />
            <sidebar-tag-counts
              class="feed__tag-counts feed__sidebar-box"
              v-if="data.tagCounts && data.tagCounts.length"
              :tags="data.tagCounts"
              :current-tags="currentTags"
            />
          </template>
        </div>
        <div class="feed-main" :class="layout">
          <has-none
            :has-content="data.BlogPosts.length"
            noneMessage="There are no blog posts here."
          >
            <div class="feed-main-items" :class="layout" ref="contentArea">
              <blog-post
                v-for="blogPost in data.BlogPosts"
                :key="blogPost.id"
                :data="blogPost"
                :showComments="false"
                :expandable="true"
                @select-tag="goToTag"
                @reportPost="openReportPostDialog($event)"
              />
            </div>
            <footer class="feed-footer">
              <pagination
                :current-page="Number(currentPage)"
                @pageChanged="onPageChange"
                :last-page="lastPage"
                v-if="lastPage > 1"
              />
            </footer>
          </has-none>
        </div>
        <div v-if="layout === 'two-sidebars'">
          <sidebar-select-order
            class="feed__select-order feed__sidebar-box"
            :selected="order"
            :on-news-feed="true"
          />
          <sidebar-tag-counts
            class="feed__tag-counts feed__sidebar-box"
            v-if="data.tagCounts && data.tagCounts.length"
            :tags="data.tagCounts"
            :current-tags="currentTags"
          />
        </div>
      </div>
      <div
        class="feed-popular-blogs"
        v-if="!isTablet && data && data.suggestions && data.suggestions.length"
      >
        <popular-communities :data="data" />
      </div>
    </await-response>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import BlogPost from '@/components/Blog/BlogPost';
import Pagination from '@/components/common/Pagination';
import PopularCommunities from '~common/PopularCommunities';
import { lastBlogPostPage } from '@/services/BlogPost/blogPost.service';
import paginationMixin from '@/mixins/pagination.mixin';
import tagListMixin from '@/mixins/tag-list.mixin';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import SidebarDisplayOptions from '~common/SidebarDisplayOptions';
import AwaitResponse from '~common/AwaitResponse';
import HasNone from '~common/HasNone';

export default {
  props: {
    tagNames: {
      type: String
    },
    order: {
      type: String
    }
  },
  data() {
    return {
      loaded: false,
      isMobileOptionsTransparent: false
    };
  },
  components: {
    PopularCommunities,
    BlogPost,
    Pagination,
    SidebarTagCounts,
    SidebarSelectOrder,
    SidebarDisplayOptions,
    AwaitResponse,
    HasNone
  },
  mixins: [paginationMixin, tagListMixin],
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    ...mapState({
      data: state => state.feed.data,
      feedPage: state => state.feed.currentPage,
      activeAliasId: state => state.alias.activeAliasId,
      columns: state => state.feed.display.columns,
      noReblogs: state => state.feed.display.showReblogs === 'hide',
      headerHeight: state => state.common.headerHeight
    }),
    ...mapGetters(['layout', 'maxColumnsCount', 'isTablet']),
    lastPage() {
      return lastBlogPostPage(this.data.count);
    },
    currentTags() {
      return this.tagNames && JSON.parse(this.tagNames);
    },
    currentColumns() {
      return Math.min(this.columns, this.maxColumnsCount);
    }
  },
  methods: {
    ...mapActions(['getFeedData', 'setFeedPage', 'reloadFeed']),
    async getData(pagination) {
      await this.setFeedPage({
        page: pagination,
        tagNames: this.tagNames,
        order: this.order,
        noReblogs: this.noReblogs
      });
    },
    openReportPostDialog(blogPost) {
      this.$parent.handleOpenSubmitReportModal({
        isBlogPost: true,
        postId: blogPost.id,
        commentId: null,
        postingAlias: blogPost.Alias.name,
        updatedAt: blogPost.updatedAt
      });
    },
    handleScroll() {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.offsetHeight - window.innerHeight;
      if (scrollTop + 10 > scrollHeight) {
        this.isMobileOptionsTransparent = true;
        return;
      }
      const minScrollToHide = 80;
      this.isMobileOptionsTransparent =
        scrollTop > minScrollToHide && scrollTop > this._previousScrollTopValue;
      this._previousScrollTopValue = scrollTop;
    }
  },
  watch: {
    activeAliasId() {
      return this.reloadFeed();
    }
  },
  async mounted() {
    await this.getData(this.currentPage);
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
@import '@/assets/scss/common/_variables';
.feed {
  overflow-y: auto;
  grid-area: content;
  padding: var(--element-padding-xl);
  @include mobile {
    overflow: visible;
    padding-bottom: 40px;
  }

  &.pinterest {
    padding: var(--element-padding-l);
    @include mobile {
      padding-bottom: 40px;
    }
  }

  &-content {
    display: flex;
  }

  &-news {
    display: grid;
    grid-gap: var(--element-margin-m);
    grid-auto-rows: 20px;
    flex-grow: 13;
    flex-basis: 0;
    @include tablet {
      display: block;
    }

    &.one-sidebar {
      grid-template-columns: var(--width-medium-small) auto;
    }
    &.two-sidebars {
      grid-template-columns: var(--width-medium-small) auto var(--width-small);
    }
    grid-gap: var(--element-margin-m);
    /** @TODO take it from the variable @see https://temperance-software.atlassian.net/browse/FAN-219 */
    grid-auto-rows: 20px;
  }
  &.pinterest &-news {
    flex-grow: 17;
    flex-basis: 0;
  }

  &-main-items {
    display: grid;
    grid-gap: var(--element-margin-m);
    grid-auto-rows: 20px;
    grid-template-columns: repeat(var(--columns-number), minmax(100px, 1fr));
    @include tablet {
      display: block;
    }
  }

  &__sidebar-box:not(:first-child) {
    margin-top: var(--element-margin-s);
    @include tablet {
      margin-top: 0;
    }
  }

  &-popular-blogs {
    flex-grow: 3;
    flex-basis: 0;
    margin-left: var(--element-margin-xl);
  }
  &.pinterest &-popular-blogs {
    margin-left: var(--element-margin-m);
  }
  &-wrapper {
    @include tablet {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    @include mobile {
      position: sticky;
      top: var(--header-height);
      z-index: var(--z-index-1);
      transition: opacity var(--transition-default);
    }
    &_transparent {
      @include mobile {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
  &__display-options {
    @include tablet {
      width: 68%;
    }
  }

  &__select-order {
    @include tablet {
      width: 30%;
    }
  }

  &-footer {
    flex-grow: 3;
    padding-bottom: var(--element-padding-l);
  }
}

::v-deep {
  .feed__display-options {
    @include tablet {
      .options-rows {
        display: flex;
        justify-content: center;

        &__row {
          margin-left: var(--element-margin-l);
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
    @include mobile {
      .options-rows {
        justify-content: flex-start;
      }
    }
  }
}
</style>
