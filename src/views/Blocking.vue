<template>
  <div class="blocking">
    <div class="blocking__tag-input-holder">
      <h3 class="blocking__title">Block tag</h3>
      <tag-input
        class="blocking__tag-input"
        name="tags"
        placeholder="Enter a tag"
        :allow-new="false"
        :list="[]"
        @list-change="onSelectTag"
        :height-limited="true"
      />
    </div>
    <following-following
      :data="data"
      @block="handleBlock"
      @remove-tag="unblockTag"
      button-type="block"
      activity-name="Blocked on"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getBlocking } from '@/services/following.service';
import {
  createBlock,
  deleteBlock,
  followableTypes
} from '@/services/follow.service';
import FollowingFollowing from '@/components/Following/FollowingFollowing';
import TagInput from '~common/Fields/TagInput';

export default {
  components: { FollowingFollowing, TagInput },
  data() {
    return {
      data: { followTag: [], followBlog: [], followCommunity: [] },
      currentPage: 1
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    async handleBlock(data) {
      try {
        await createBlock(data.id, data.name, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async getData() {
      this.data = await getBlocking(this.activeAliasId);
    },
    async unblockTag(id) {
      await deleteBlock(id, followableTypes.tag);
      await this.getData();
    },
    async onSelectTag(tags) {
      const tag = tags[0];
      try {
        await createBlock(tag.id, 'tag', {
          alias: this.activeAliasId
        });
        if (
          !this.data.followTag.some(iteratedTag => iteratedTag.id === tag.id)
        ) {
          this.data.followTag.push(tag);
        }
      } catch (error) {
        return;
      }
    }
  },
  watch: {
    activeAliasId: {
      handler(val) {
        if (val) {
          this.getData();
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.blocking {
  grid-area: content;
  overflow-y: auto;
  &__tag-input-holder {
    margin: var(--element-margin-xl) 35px 0 var(--element-margin-xl);
  }
  &__title {
    font-family: 'OpenSans-Bold', sans-serif;
    font-size: var(--size-title);
    color: var(--text-primary);
  }
  &__tag-input {
    max-width: 500px;
  }
}
</style>
