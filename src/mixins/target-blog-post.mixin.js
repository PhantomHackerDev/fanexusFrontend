export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    blogPostIn() {
      return (
        this.data.targetBlogPost &&
        (this.data.targetBlogPost.BlogId ? 'blog' : 'community')
      );
    },
    blogPostLocation() {
      return (
        this.data.targetBlogPost &&
        (this.data.targetBlogPost.BlogId
          ? this.data.targetBlogPost.Blog.link ||
            this.data.targetBlogPost.Blog.id
          : this.data.targetBlogPost.Community.link ||
            this.data.targetBlogPost.Community.id)
      );
    }
  }
};
