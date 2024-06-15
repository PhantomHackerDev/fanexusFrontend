export default {
  props: {
    currentPage: {
      type: [Number, String],
      default: 1
    }
  },
  methods: {
    async onPageChange(page) {
      await this.$router.push({
        params: {
          currentPage: page
        }
      });
    }
  },
  watch: {
    async currentPage(page) {
      await this.getData(page);
      this.$refs.contentArea.scrollIntoView();
    }
  }
};
