<template>
  <span>
    has
    <router-link
      :to="{
        name: `${blogPostIn}-with-blog-post`,
        params: {
          name: onBlogPostSource.link || onBlogPostSource.id,
          postId: onBlogPost.id,
          commentId: data.targetCommentId
        }
      }"
    >
      commented
    </router-link>
    <activity-content
      v-if="data.sourceComment"
      :content="data.sourceComment.content"
      content-type="comment"
    />
    <div v-else>(comment not found)</div>
    on your
    <router-link
      :to="{
        name: `${blogPostOriginIn}-with-blog-post`,
        params: {
          name: onBlogPostSource.link || onBlogPostSource.id,
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
import { commentableTypes } from '@/services/Comment/comment.service';
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
    blogPostOriginIn() {
      return this.belongsToOrigin(this.onBlogPost);
    },
    blogPostIn() {
      return this.belongsTo(this.onBlogPost);
    },
    targetType() {
      return this.data.targetBlogPostId
        ? this.forReblog
          ? commentableTypes.reblog
          : commentableTypes.blogPost
        : commentableTypes.comment;
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
    belongsToOrigin(blogPost) {
      return blogPost.BlogId ? 'blog' : 'community';
    },
    belongsTo(blogPost) {
      return this.data.targetCommentId
        ? blogPost.BlogId
          ? 'comment-blog'
          : 'comment-community'
        : blogPost.BlogId
        ? 'blog'
        : 'community';
    }
  }
};
</script>
