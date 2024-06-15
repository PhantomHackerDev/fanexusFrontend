<template>
  <await-response :has-response="loaded">
    <section class="likes-comments">
      <has-none :has-content="data.BlogPosts.length">
        <comment
          :key="`${id}-${index}`"
          v-for="({ id, showComment }, index) in data.BlogPosts.filter(
            ({ showComment }) => showComment
          )"
          :comment="showComment"
          :blog-post-id="id"
          :standalone="true"
        />
      </has-none>
    </section>
  </await-response>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import Comment from '@/components/common/Comments/Comment';
import AwaitResponse from '~common/AwaitResponse';
import HasNone from '~common/HasNone';

export default {
  components: {
    Comment,
    AwaitResponse,
    HasNone
  },
  computed: {
    ...mapState({
      data: state => state.feed.data
    }),
    ...mapGetters(['activeAliasBlogUrl'])
  },
  data() {
    return {
      loaded: false
    };
  },
  methods: {
    ...mapActions(['getFeedData']),
    getData() {
      return this.getFeedData({
        name: this.activeAliasBlogUrl,
        pagination: this.currentPage,
        type: feedTypes.comments
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
.likes-comments {
  padding: var(--element-padding-s);
}
</style>
