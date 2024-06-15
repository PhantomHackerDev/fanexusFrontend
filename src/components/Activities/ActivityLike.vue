<template>
  <span>
    has liked your
    <router-link
      :to="{
        name: `${blogPostIn}-with-blog-post`,
        params: {
          name: onBlogPostLocation,
          postId: onBlogPost.id
        }
      }"
      >{{ targetType }}</router-link
    >
    <activity-content
      :content="targetContent"
      :content-type="targetType"
      v-if="!forReblog || targetContent.length"
    />
  </span>
</template>

<script>
import { likeableTypes } from '@/services/activities.service';
import ActivityContent from '@/components/Activities/ActivityContent';

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    ActivityContent
  },
  computed: {
    onBlogPost() {
      return this.data.targetBlogPost
        ? this.data.targetBlogPost
        : this.data.targetComment.rootBlogPost;
    },
    onBlogPostSource() {
      return this.onBlogPost.Blog || this.onBlogPost.Community;
    },
    onBlogPostLocation() {
      return this.onBlogPostSource.link || this.onBlogPostSource.id;
    },
    blogPostIn() {
      return this.belongsTo(this.onBlogPost);
    },
    targetType() {
      return this.data.targetBlogPostId
        ? this.forReblog
          ? likeableTypes.reblog
          : likeableTypes.blogPost
        : likeableTypes.comment;
    },
    targetContent() {
      return this.data.targetBlogPostId
        ? this.data.targetBlogPost
          ? this.data.targetBlogPost.content
          : '(deleted blog post)'
        : this.data.targetComment
        ? this.data.targetComment.content
        : '(deleted comment)';
    },
    forReblog() {
      return this.data.type.endsWith('-reblog');
    }
  },
  methods: {
    belongsTo(blogPost) {
      return blogPost.BlogId ? 'blog' : 'community';
    }
  }
};
</script>
