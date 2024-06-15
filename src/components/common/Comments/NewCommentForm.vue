<template>
  <form class="comments-new">
    <avatar
      :file="activeAliasSrc"
      class="comments-new__avatar"
      size="md"
      @click.native.prevent="goToOrigin"
    />
    <div class="comments-new-textarea">
      <comment-input
        :newComment="newComment"
        class="comments-new-textarea__input"
        placeholder="Type your comment here"
        @createComment="$emit('createComment')"
        @input="comment => $emit('input', comment)"
        @space-remaining="$emit('space-remaining', $event)"
      />
    </div>
  </form>
</template>
<script>
import { mapGetters } from 'vuex';
import { routerSecureNavigation } from '@/services/router.service';
import CommentInput from '@/components/common/Comments/CommentInput';
import Avatar from '~common/Avatar';

export default {
  components: {
    CommentInput,
    Avatar
  },
  model: {
    prop: 'newComment'
  },
  props: {
    newComment: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['activeAliasSrc', 'activeAliasBlogUrl'])
  },
  methods: {
    goToOrigin() {
      routerSecureNavigation({
        /** we should just ignore cases where there's no origin or Blog field in the data */
        name: 'blog',
        params: { name: this.activeAliasBlogUrl }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.comments-new {
  display: flex;
  align-items: stretch;
  margin: var(--element-margin-s) var(--element-margin-l);
  @include mobile {
    display: block;
  }

  &-textarea {
    flex: 1;
  }

  &.child {
    margin: var(--element-margin-s) 0;
  }
  &__avatar {
    cursor: pointer;
    margin-right: var(--element-margin-m);
  }
}
</style>
