<template>
  <div class="comments">
    <new-comment-form
      :new-comment="newComment"
      @input="$emit('new-comment-input', $event)"
      @space-remaining="$emit('space-remaining', $event)"
      v-if="canComment"
      @createComment="$emit('createComment')"
    />
    <div v-if="comments && comments.length" class="comments-list">
      <comment
        :key="`${comment.id}-${index}`"
        v-for="(comment, index) in comments"
        :comment="comment"
        :blogPostId="blogPostId"
        :can-comment="canComment"
        :isExtraDepth="!!comment.parentCommentId"
        :background-color="backgroundColor"
        :directThread="directThread"
        @delete="$id => $emit('delete', $id)"
        @refresh="$emit('refresh')"
        @report="$emit('reportComment', comment)"
        @goToThread="$thread => $emit('goToThread', $thread)"
        @refreshData="$emit('refreshData')"
        :is-blog-post-author="isBlogPostAuthor"
      />
    </div>
  </div>
</template>
<script>
import NewCommentForm from '@/components/common/Comments/NewCommentForm';
import Comment from '@/components/common/Comments/Comment';

export default {
  components: {
    NewCommentForm,
    Comment
  },
  props: {
    blogPostId: {
      type: undefined
    },
    newComment: {
      type: String
    },
    canComment: {
      type: Boolean,
      default: true
    },
    comments: {
      /** @TODO add default value */
      type: Array
    },
    backgroundColor: {
      type: Array
    },
    isBlogPostAuthor: {
      type: Boolean,
      default: false
    },
    directThread: {
      type: Number
    }
  }
};
</script>
<style lang="scss" scoped>
.comments {
  padding-bottom: var(--element-padding-s);
  &-list {
    margin: 0 var(--element-margin-l);
    ::v-deep .child {
      margin: 0;
    }
  }
}
</style>
