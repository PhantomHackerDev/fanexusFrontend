<template>
  <await-response :has-response="loaded">
    <section class="likes-blog-posts" :class="layout" ref="contentArea">
      <!-- @TODO will be revised in https://temperance-software.atlassian.net/browse/FAN-210 -->
      <div class="likes-blog-posts__sidebar">
        <sidebar-display-options
          v-if="!isMobile"
          class="likes-blog-posts__display-options likes-blog-posts__sidebar-box"
        />
        <template v-if="layout === 'one-sidebar'">
          <sidebar-select-order
            class="likes-blog-posts__select-order likes-blog-posts__sidebar-box"
            :selected="order"
          />
          <sidebar-tag-counts
            class="likes-blog-posts__tag-counts likes-blog-posts__sidebar-box"
            v-if="data.tagCounts && data.tagCounts.length"
            :tags="data.tagCounts"
            :current-tags="currentTags"
          />
        </template>
      </div>
      <blog-all-posts
        :blog-posts="data.BlogPosts"
        :count="data.count"
        :current-page="Number(currentPage)"
        @onPageChange="onPageChange"
        @reportPost="reportPost($event)"
        class="likes-blog-posts__all-posts"
      />
      <div v-if="layout === 'two-sidebars'">
        <sidebar-select-order
          class="likes-blog-posts__select-order likes-blog-posts__sidebar-box"
          :selected="order"
        />
        <sidebar-tag-counts
          class="likes-blog-posts__tag-counts likes-blog-posts__sidebar-box"
          v-if="data.tagCounts && data.tagCounts.length"
          :tags="data.tagCounts"
          :current-tags="currentTags"
        />
      </div>
    </section>
  </await-response>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import BlogAllPosts from '@/components/Blog/BlogAllPosts';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import SidebarDisplayOptions from '~common/SidebarDisplayOptions';
import AwaitResponse from '~common/AwaitResponse';
import paginationMixin from '@/mixins/pagination.mixin';

export default {
  props: {
    tagNames: {
      type: String
    },
    order: {
      type: String
    }
  },
  components: {
    BlogAllPosts,
    SidebarTagCounts,
    SidebarSelectOrder,
    SidebarDisplayOptions,
    AwaitResponse
  },
  computed: {
    ...mapState({
      data: state => state.feed.data
    }),
    ...mapGetters(['layout', 'activeAliasBlogUrl', 'isMobile']),
    currentTags() {
      return this.tagNames && JSON.parse(this.tagNames);
    }
  },
  mixins: [paginationMixin],
  data() {
    return {
      loaded: false
    };
  },
  methods: {
    ...mapActions(['getFeedData']),
    reportPost(blogPost) {
      this.$emit('reportPost', blogPost);
    },
    getData() {
      return this.getFeedData({
        name: this.activeAliasBlogUrl,
        pagination: this.currentPage,
        type: feedTypes.likes,
        tagNames: this.tagNames,
        order: this.order
      });
    }
  },
  async mounted() {
    await this.getData();
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.likes-blog-posts {
  padding: var(--element-padding-l);
  display: grid;
  grid-gap: var(--element-margin-m);
  @include mobile {
    display: block;
    padding: var(--element-padding-l) 0;
  }
  &.one-sidebar {
    grid-template-columns: var(--width-medium-small) auto;
  }
  &.two-sidebars {
    grid-template-columns: var(--width-medium-small) auto var(--width-small);
  }

  &__sidebar-box:not(:first-child) {
    margin-top: var(--element-margin-s);
  }
  &__sidebar {
    @include mobile {
      display: flex;
      flex-direction: column;
    }
  }
  &__select-order {
    @include mobile {
      order: 5;
    }
  }
  &__all-posts {
    @include mobile {
      margin-top: var(--element-margin-l);
    }
  }
}
</style>
