<template>
  <section class="all-posts">
    <has-none
      :has-content="blogPosts.length"
      noneMessage="There are no blog posts here."
    >
      <div
        class="all-posts-content"
        :style="{ '--columns-number': currentColumns }"
      >
        <div class="all-posts-items">
          <blog-post
            :key="blog.id"
            :data="blog"
            :showComments="false"
            :expandable="true"
            v-for="blog in blogPosts"
            @select-tag="goToTag"
            @reportPost="openReportPostDialog($event)"
          />
        </div>
        <pagination
          :current-page="currentPage"
          @pageChanged="$emit('onPageChange', $event)"
          :last-page="lastPage"
          v-if="lastPage > 1"
        />
      </div>
    </has-none>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BlogPost from '@/components/Blog/BlogPost';
import { communityAreas } from '@/services/Community/community.service';
import Pagination from '~common/Pagination';
import HasNone from '~common/HasNone';
import { lastBlogPostPage } from '@/services/BlogPost/blogPost.service';
import tagListMixin from '@/mixins/tag-list.mixin';

export default {
  name: communityAreas.posts,
  components: {
    BlogPost,
    Pagination,
    HasNone
  },
  props: {
    blogPosts: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    communityId: {
      type: [Number, String],
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  mixins: [tagListMixin],
  computed: {
    lastPage() {
      return lastBlogPostPage(this.count);
    },
    currentColumns() {
      return Math.min(this.columns, this.maxColumnsCount);
    },
    ...mapState({
      columns: state => state.feed.display.columns
    }),
    ...mapGetters(['maxColumnsCount'])
  },
  methods: {
    openReportPostDialog(blogPost) {
      this.$parent.handleOpenSubmitReportModal({
        isBlogPost: true,
        postId: blogPost.id,
        commentId: null,
        postingAlias: blogPost.Alias.name,
        updatedAt: blogPost.updatedAt
      });
    }
  }
};
</script>

<style scoped lang="scss">
.all-posts {
  &-items {
    display: grid;
    grid-gap: var(--element-margin-m);
    grid-auto-rows: 20px;
    grid-template-columns: repeat(var(--columns-number), minmax(100px, 1fr));
  }
}
</style>
