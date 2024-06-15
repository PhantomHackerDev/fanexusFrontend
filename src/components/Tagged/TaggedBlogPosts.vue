<template>
  <await-response :has-response="loaded">
    <div class="tagged-blog-posts" :class="layout" ref="contentArea">
      <div v-if="!isTablet" class="tagged-blog-posts__sidebar">
        <sidebar-display-options
          class="tagged-blog-posts__display-options tagged-blog-posts__sidebar-box"
        />
        <template v-if="layout === 'one-sidebar'">
          <sidebar-select-order
            class="tagged-blog-posts__select-order tagged-blog-posts__sidebar-box"
            :selected="order"
          />
          <sidebar-tag-counts
            class="tagged-blog-posts__tag-counts tagged-blog-posts__sidebar-box"
            v-if="data.tagCounts && data.tagCounts.length"
            :tags="data.tagCounts"
            :current-tags="currentTags"
          />
          <tag-show
            class="tagged-blog-posts__sidebar-box"
            v-for="(tag, index) of currentTags"
            :key="`${tag}-${index}`"
            context="sidebar"
            :name="tag"
          />
        </template>
      </div>
      <blog-all-posts
        :blogPosts="data.BlogPosts"
        :count="data.count"
        :current-page="Number(currentPage)"
        class="tagged-blog-posts__all-posts"
        @onPageChange="onPageChange"
        @reportPost="reportPost($event)"
      />
      <div v-if="layout === 'two-sidebars'">
        <sidebar-select-order
          class="tagged-blog-posts__select-order tagged-blog-posts__sidebar-box"
          :selected="order"
        />
        <sidebar-tag-counts
          class="tagged-blog-posts__tag-counts tagged-blog-posts__sidebar-box"
          v-if="data.tagCounts && data.tagCounts.length"
          :tags="data.tagCounts"
          :current-tags="currentTags"
        />
        <tag-show
          class="tagged-blog-posts__sidebar-box"
          v-for="(tag, index) of currentTags"
          :key="`${tag}-${index}`"
          context="sidebar"
          :name="tag"
        />
      </div>
    </div>
  </await-response>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import BlogAllPosts from '@/components/Blog/BlogAllPosts';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import SidebarDisplayOptions from '~common/SidebarDisplayOptions';
import paginationMixin from '@/mixins/pagination.mixin';
import TagShow from '@/views/TagShow';
import AwaitResponse from '~common/AwaitResponse';

export default {
  props: {
    tagNames: {
      required: true,
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
    TagShow,
    AwaitResponse
  },
  mixins: [paginationMixin],
  computed: {
    ...mapState({
      data: state => state.feed.data
    }),
    ...mapGetters(['layout', 'isTablet']),
    currentTags() {
      return JSON.parse(this.tagNames);
    }
  },
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
    async getData() {
      return this.getFeedData({
        tagNames: this.tagNames,
        pagination: this.currentPage,
        type: feedTypes.tagged,
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
.tagged-blog-posts {
  padding: var(--element-padding-l);
  display: grid;
  grid-gap: var(--element-margin-m);
  grid-template-columns: var(--width-small) auto;
  @include tablet {
    display: block;
    padding-bottom: 50px;
  }
  &.one-sidebar {
    grid-template-columns: var(--width-medium-small) auto;
  }
  &.two-sidebars {
    grid-template-columns: var(--width-medium-small) auto var(--width-small);
  }
  &__sidebar {
    @include tablet {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto;
      grid-gap: 10px;
    }
  }

  &__sidebar-box:not(:first-child) {
    margin-top: var(--element-margin-s);
    @include tablet {
      margin-top: 0;
    }
  }
  &__all-posts {
    @include tablet {
      margin-top: 10px;
    }
  }
  &__all-posts {
    @include tablet {
      margin-top: 10px;
    }
  }
}
</style>
