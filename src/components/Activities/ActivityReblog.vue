<template>
  <span>
    has
    <router-link
      v-if="data.sourceReblog"
      :to="{
        name: `${reblogIn}-with-blog-post`,
        params: {
          name: reblogSource.link || reblogSource.id,
          postId: data.sourceReblog.id
        }
      }"
      >reblogged</router-link
    >
    your
    <component
      :is="this.data.targetBlogPost ? 'router-link' : 'span'"
      :to="{
        name: `${blogPostIn}-with-blog-post`,
        params: {
          name: blogPostLocation,
          postId: data.targetBlogPostId
        }
      }"
      >{{ targetType }}</component
    >
    <activity-content
      :content="sourceContent"
      content-type="post"
      v-if="!forReblog || sourceContent.length"
    /><template
      v-if="data.sourceReblog && data.sourceReblog.content.trim().length"
    >
      with comment<activity-content
        :content="data.sourceReblog.content"
        content-type="post"
    /></template>
  </span>
</template>

<script>
import { mapState } from 'vuex';
import ActivityContent from '@/components/Activities/ActivityContent';
import targetBlogPostMixin from '@/mixins/target-blog-post.mixin';

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
  mixins: [targetBlogPostMixin],
  computed: {
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id
    }),
    sourceContent() {
      return this.data.targetBlogPost
        ? this.data.targetBlogPost.content
        : '(deleted blog post)';
    },
    reblogIn() {
      return this.belongsTo(this.data.sourceReblog);
    },
    reblogSource() {
      return this.data.sourceReblog.Blog || this.data.sourceReblog.Community;
    },
    targetType() {
      return this.forReblog ? 'reblog' : 'blog post';
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
