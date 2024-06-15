<template>
  <article
    class="comments-list-item"
    :class="{ 'comments-list-item__boxed': standalone }"
  >
    <div
      :class="{ active: isShowAllCommentsComputed || isExtraDepth }"
      class="comments-list-item__buttons"
    >
      <button
        v-if="isShowAllCommentsComputed"
        class="comments-list-item__button-thread"
        @click="handleViewAllComments"
      >
        View all comments
      </button>
      <button
        v-if="isExtraDepth"
        class="comments-list-item__button-thread"
        @click="() => goToThread(comment.parentCommentId)"
      >
        Show parent comments
      </button>
    </div>

    <div class="comments-list-item__wrapper">
      <avatar
        class="comments-list-item__avatar"
        size="md"
        :file="comment.Alias.avatar.src"
        @click.native.prevent="goToOrigin"
      />
      <div class="comments-list-item__content">
        <div class="comments-list-item-title">
          <h2 class="comments-list-item-title__name">
            {{ comment.Alias.name }}
          </h2>
          <p
            class="comments-list-item-title__date"
            :class="{ 'comments-list-item-title__date-standalone': standalone }"
            @click.stop="openBlogPostModal"
          >
            {{ comment.updatedAt | dateFormat }}
          </p>
        </div>
        <comment-input
          :new-comment="comment.content"
          v-if="editing"
          :editing="true"
          @input="comment => (editedComment = comment)"
          @createComment="handleUpdateComment(comment.id)"
        />
        <expandable content-label="comment" :ref="comment.id" v-else>
          <div
            v-if="comment.content != ' '"
            ref="commentText"
            class="comments-list-item__text"
            v-html="comment.content"
          />
          <div
            ref="commentText"
            class="comments-list-item__text deleted"
            v-else
          >
            this comment has been deleted
          </div>
        </expandable>
        <action-buttons-group
          class="comment"
          :engagementStats="comment.engagementStats"
          :commentsLength="commentsLength"
          :showNewCommentForm="showNewCommentForm"
          :showChildComments="showChildComments"
          :userHasEditPermissions="comment.userHasEditPermissions"
          :is-blog-post-author="isBlogPostAuthor"
          @toggleCommentForm="
            canComment && (showNewCommentForm = !showNewCommentForm)
          "
          @toggleChildComments="showChildComments = !showChildComments"
          @likeClicked="commentLikeToggle"
          @delete="() => handleDeleteComment(comment.id)"
          @edit="handleEditComment"
          @report="() => handleReportComment(comment)"
          @show-context="openBlogPostModal"
          :last-option="standalone ? 'blogPost' : 'replies'"
          :blog-post-exists="comment.rootBlogPostId"
          :userLiked="comment.userLiked"
          :disabled="comment.content != ' ' ? false : true"
          :options="
            dropdownOptionsComment(comment.userHasEditPermissions, isModerator)
          "
        />
        <button
          v-if="comment.hasChildComments || comment.numComments > 0"
          class="comments-list-item__button-thread"
          @click="() => goToThread()"
        >
          Continue this thread
          <i class="comments-list-item__button-thread-right-arrow" />
        </button>
      </div>
    </div>

    <new-comment-form
      v-if="showNewCommentForm"
      class="child"
      v-model="newComment"
      @space-remaining="spaceRemaining = $event"
      @createComment="() => handleCreateComment(comment.id)"
    />
    <div
      v-if="commentsLength && showChildComments"
      class="child-comment__wrapper"
    >
      <comment
        v-for="(childComment, index) in comment.childComments"
        :key="`${childComment.id}-${index}`"
        :comment="childComment"
        :can-comment="canComment"
        :blogPostId="blogPostId"
        :background-color="backgroundColor"
        @input="comment => (newComment = comment)"
        @refresh="refresh"
        @delete="() => handleDeleteComment(childComment.id)"
        @createComment="() => handleCreateComment(childComment.parentCommentId)"
        @report="handleReportComment(childComment)"
        @goToThread="$thread => $emit('goToThread', $thread)"
        :is-blog-post-author="isBlogPostAuthor"
      />
    </div>
  </article>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { removeCommentById } from '@/utils/array';
import userContent from '@/utils/userContent';
import { routerSecureNavigation } from '@/services/router.service';
import {
  getComment,
  createComment,
  commentDelete,
  updateComment,
  commentLike,
  commentUnlike
} from '@/services/Comment/comment.service';
import dropdownOptionsComment from '@/services/Comment/comment.dropdownOptions';
import ActionButtonsGroup from '~common/ActionButtonsGroup';
import Avatar from '~common/Avatar';
import NewCommentForm from '@/components/common/Comments/NewCommentForm';
import Comment from '@/components/common/Comments/Comment';
import CommentInput from '@/components/common/Comments/CommentInput';
import { adjustColor } from '@/utils/color';
import Expandable from '~common/Expandable';

export default {
  name: 'comment',
  props: {
    blogPostId: {
      type: undefined
    },
    canComment: {
      type: Boolean,
      default: true
    },
    comment: {
      type: Object
    },
    standalone: {
      type: Boolean,
      default: false
    },
    isExtraDepth: {
      type: Boolean,
      default: false
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
  },
  components: {
    ActionButtonsGroup,
    Avatar,
    NewCommentForm,
    Comment,
    CommentInput,
    Expandable
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      isModerator: state => state.auth.userData && state.auth.userData.moderator
    }),
    ...mapGetters(['activeAliasBlog']),
    isShowAllCommentsComputed() {
      return (
        this.isExtraDepth ||
        this.isShowAllComments ||
        this.comment.lastCommentThread
      );
    },
    originBlog() {
      return this.current.alias.Blog;
    },
    commentsLength() {
      const comments = this.comment.childComments;

      return comments ? comments.length : 0;
    }
  },
  data() {
    return {
      newComment: '',
      showChildComments: false,
      showNewCommentForm: false,
      dropdownOptionsComment,
      editing: false,
      editedComment: this.comment.content,
      isShowAllComments: false,
      spaceRemaining: 0
    };
  },
  methods: {
    handleViewAllComments() {
      this.$emit('refreshData');
      this.isShowAllComments = false;
    },
    goToOrigin() {
      const { link, id } = this.comment.Alias.Blog;
      routerSecureNavigation({
        name: 'blog',
        params: { name: link || id, id: link ? undefined : 'id' }
      });
    },
    /** @TODO revise to use only comment.id in emitter */
    async goToThread(id = this.comment.id) {
      const commentThread = await getComment(id);
      this.$emit('goToThread', commentThread);
      this.isShowAllComments = true;

      if (this.directThread) {
        // const commentId = this.directThread;
        this.$refs.commentText.scrollIntoView({ behavior: 'smooth' });
      }
    },
    async refresh() {
      this.showNewCommentForm = false;
      this.newComment = '';
    },
    async handleCreateComment(parentCommentId) {
      if (!this.newComment || this.spaceRemaining < 0) return;

      const payload = {
        alias: this.activeAliasId,
        content: this.newComment
      };

      if (parentCommentId) {
        payload.parentComment = parentCommentId;
      } else {
        payload.blogPost = this.blogPostId;
      }

      try {
        const data = await createComment(payload);
        /** the FE will show as many as possible when the user is just around. but at the modal/page reload, the BE will provide that flag, so the view will be limited */
        if (!this.comment.childComments) {
          this.$set(this.comment, 'childComments', []);
        }
        this.comment.childComments.push(data);
        this.refresh();
        this.showChildComments = true;
      } catch (e) {
        return false;
      }
    },
    /** @TODO resolve all TODOS */
    handleDeleteComment(id) {
      this.confirmHandler(this.handleDelComment, 'comment', id);
    },
    confirmHandler(callback, contentType, id) {
      this.$confirm({
        message: `Are you sure you want to delete this ${contentType}?`,
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: confirm => {
          if (confirm) {
            callback(id);
          }
        }
      });
    },
    async handleDelComment(id) {
      if (id === this.comment.id) {
        if (this.comment.userHasEditPermissions) {
          this.$emit('delete', id);
        } else {
          this.setModeratorDelete({ id: this.comment.id, type: 'comment' });
        }
      } else {
        await commentDelete(id);
        removeCommentById(id, this.comment.childComments);
        this.refresh();
      }
    },
    handleReportComment(comment) {
      this.$emit('report', comment);
    },
    handleEditComment() {
      this.editedComment = this.content;
      this.editing = true;
    },
    async handleUpdateComment(id) {
      const payload = [id, { content: this.editedComment }];
      const data = await updateComment(...payload);
      Object.assign(this.comment, data);
      this.editing = false;
      await this.refresh();
      this.addFlashMessage({ message: 'Comment updated.' });
    },
    openBlogPostModal() {
      if (this.$route.params.postId) return;
      return this.$router.push({
        name: `${this.$route.name}-with-blog-post`,
        params: {
          postId: this.comment.rootBlogPostId
        }
      });
    },
    async commentLikeToggle() {
      const { id, userLiked, engagementStats } = this.comment;
      const body = [id, { alias: this.activeAliasId }];

      userLiked ? await commentUnlike(...body) : await commentLike(...body);
      userLiked ? engagementStats.likes-- : engagementStats.likes++;
      this.addToStat({ stat: 'likesCount', change: userLiked ? -1 : 1 });
      this.comment.userLiked = !userLiked;
    },
    addRel() {
      userContent.addRel(this.$refs.commentText);
    },
    ...mapActions(['addToStat', 'setModeratorDelete', 'addFlashMessage'])
  },
  watch: {
    backgroundColor: {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            for (const childElement of this.$refs.commentText.getElementsByTagName(
              '*'
            )) {
              adjustColor(childElement, value);
            }
          });
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.directThread) {
      this.goToThread(this.directThread);
    }
  },
  mounted() {
    if (this.directThread) {
      this.showChildComments = true;
    }
    this.addRel();
  },
  updated() {
    this.$refs.commentText.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.comments-list-item {
  display: flex;
  flex-direction: column;
  margin-top: var(--element-margin-s);

  &__wrapper {
    display: flex;
  }
  &__avatar {
    cursor: pointer;
    margin-right: var(--element-margin-m);
  }
  &__content {
    min-width: 0;
    flex-grow: 1;
  }

  .comment {
    margin-bottom: var(--element-padding-s);
  }

  &-title {
    display: flex;
    align-items: center;
    &__name {
      color: var(--text-primary);
      font-size: var(--size-regular);
      margin: calc(-1 * var(--element-margin-s));
      margin-right: 0;
      padding: var(--element-margin-s);
      min-width: 0;
      word-wrap: break-word;
      overflow: auto;
    }
    &__date {
      color: var(--text-date-and-time);
      font-size: var(--size-small);
      margin-bottom: 0;
      &-standalone {
        cursor: pointer;
      }
    }
  }
  &__text {
    color: var(--text-primary);
    font-size: var(--size-regular);
    word-wrap: break-word;
    overflow: auto;
    padding-top: var(--element-padding-m);
    padding-bottom: var(--element-padding-m);
    ::v-deep {
      @include user-content;
    }
  }
  &__text.deleted {
    color: var(--text-secondary);
    font-size: var(--size-button);
  }
  &__buttons.active {
    margin-bottom: var(--element-margin-l);
  }
  &__button-thread {
    display: flex;
    outline: none;
    background-color: transparent;
    font-size: var(--size-button);
    text-transform: uppercase;
    font-family: 'OpenSans-Bold', sans-serif;
    color: var(--text-button-comments-show);
    transition: var(--transition-default);
    margin-bottom: var(--element-margin-s);
    &:hover {
      color: var(--BG-button-pagination-active);
    }
    &:hover &-right-arrow {
      border-color: var(--BG-button-pagination-active);
    }
    &:only-child {
      margin-bottom: 0;
    }
  }

  &__boxed {
    border: var(--border-width-default) solid var(--border-block);
    padding: var(--element-padding-s);
    border-radius: var(--border-radius);
  }
}

.child-comment__wrapper {
  margin-left: 65px;
}
</style>
