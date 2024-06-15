<template>
  <!-- @TODO test on small height screens -->
  <modal
    class="blog-post modal-overlay--centered"
    v-if="data && settings.show"
    :settings="settings"
    @close="close"
  >
    <blog-post
      slot="body"
      :data="data"
      @close="close"
      @refreshData="getBlogPostApi"
      :usedInModal="true"
      @select-tag="goToTag"
      :commentThread="commentId"
      @reportPost="openReportPostDialog($event)"
      @reportComment="openReportCommentDialog($event)"
    />
  </modal>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { getBlogPost } from '@/services/Blog/blog.service';
import Modal from '~common/Modal';
import BlogPost from '@/components/Blog/BlogPost';
import { getById } from '@/utils/array.js';
import tagListMixin from '@/mixins/tag-list.mixin';

export default {
  components: {
    Modal,
    BlogPost
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      blogPostApi: null
    };
  },
  mixins: [tagListMixin],
  computed: {
    /** @TODO make it common between @see 'src\components\Blog\SharePostModal.vue' */
    ...mapState({
      blogPosts: state => state.feed.data.BlogPosts
    }),
    blogPostStore() {
      return getById(this.postId, this.blogPosts);
    },
    postId() {
      return Number(this.$route.params.postId);
    },
    commentId() {
      return Number(this.$route.params.commentId);
    },
    data() {
      return this.blogPostStore || this.blogPostApi;
    }
  },
  methods: {
    ...mapActions(['updateBlogPostData', 'addFlashMessage']),
    close() {
      return this.$router.push({
        name: this.$route.meta.page,
        params: {
          ...this.$route.params,
          postId: undefined
        }
      });
    },
    async getBlogPostApi() {
      if (!this.blogPostStore) {
        this.blogPostApi = await getBlogPost(this.postId);
        if (!this.blogPostApi) {
          this.addFlashMessage({
            message:
              'Blog post not found. It may have been deleted, you may not have permissions, or it may not exist.',
            type: 'failure'
          });
        }
      } else {
        this.updateBlogPostData(this.postId);
      }
    },
    openReportPostDialog(blogPost) {
      this.$emit('openSubmitReportModal', {
        isBlogPost: true,
        postId: blogPost.id,
        commentId: null,
        postingAlias: blogPost.Alias.name,
        updatedAt: blogPost.updatedAt
      });
    },
    openReportCommentDialog(comment) {
      this.$emit('openSubmitReportModal', {
        isBlogPost: false,
        postId: comment.BlogPostId,
        commentId: comment.id,
        postingAlias: comment.Alias.name,
        updatedAt: comment.updatedAt
      });
    }
  },
  watch: {
    async blogPostStore(store) {
      if (!store) {
        await this.getBlogPostApi();
      }
    }
  },
  async mounted() {
    await this.getBlogPostApi();
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
::v-deep {
  .blog-post {
    &-header {
      margin: 0 var(--element-margin-l);
    }
    &-body {
      &__image {
        width: 100%;
        height: auto;
        object-fit: cover;
      }
      &__content {
        color: var(--text-primary);
        font-size: var(--size-regular);
        line-height: 1.3em;
        margin: var(--element-margin-l);
      }
    }
  }
  .modal {
    width: var(--width-large);

    margin: 20px auto;
    @include mobile {
      margin: 0;
    }

    &-content {
      margin: 0;
      border-radius: 0;
    }
    &-header {
      margin: 0;
      padding: 0;
      &-btn__close {
        background-color: var(--BG-blog-post);
        border-radius: var(--border-radius);
        opacity: var(--opacity-image-overlay);
        width: 25px;
        height: 25px;
        top: 20px;
        right: -40px;
        transform: initial;
        z-index: var(--z-index-1);
        @include mobile {
          right: 20px;
        }
      }
    }
    &-body {
      padding: 0;
    }
    &-footer {
      padding: 0;
    }
  }
}
</style>
