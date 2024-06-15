export default {
  methods: {
    goToTag(tagName) {
      this.$router.push({
        name: 'tagged-blog-posts',
        params: {
          tagNames: JSON.stringify([tagName])
        }
      });
    },
    safeGoToTag(tagName) {
      tagName !== this.name && this.goToTag(tagName);
    }
  }
};
