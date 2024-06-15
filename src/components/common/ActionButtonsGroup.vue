<template>
  <!-- @TODO need to revise this component for using props from outside -->
  <ul class="action-buttons-group">
    <li v-if="engagementStats" class="action-buttons-group__item">
      <button
        @click="$emit('likeClicked')"
        type="button"
        class="action-buttons-group__button"
        :class="{ active: userLiked, disabled }"
        :disabled="disabled"
      >
        <icon-like />
      </button>
      <span class="action-buttons-group__value">{{
        engagementStats.likes
      }}</span>
    </li>
    <li v-if="engagementStats" class="action-buttons-group__item">
      <button
        type="button"
        @click.stop="handleCommentButtonClick"
        class="action-buttons-group__button"
        :class="{ active: showNewCommentForm, disabled }"
        :disabled="disabled"
      >
        <comment-icon />
      </button>
      <span class="action-buttons-group__value">{{
        engagementStats.comments
      }}</span>
    </li>
    <li
      v-if="engagementStats && forBlogPost"
      class="action-buttons-group__item"
    >
      <button
        type="button"
        @click.stop="$emit('reblog')"
        class="action-buttons-group__button"
        :disabled="disabled"
        :class="{ disabled }"
      >
        <reblog-normal-icon />
      </button>
      <span class="action-buttons-group__value">{{
        engagementStats.reblogs
      }}</span>
    </li>
    <li
      class="action-buttons-group__item"
      v-if="userHasEditPermissions || isBlogPostAuthor || isAuthenticated"
    >
      <dots-button
        :is-adding-user="isAddingUser"
        @add="$emit('add')"
        @delete="$emit('delete')"
        @edit="$emit('edit')"
        @select="$emit('select')"
        @report="$emit('report')"
        :options="options"
        :disabled="disabled"
      />
      <!-- @TODO update share count after blogPost delete will be resolved in @see https://temperance-software.atlassian.net/browse/FAN-273 -->
    </li>
    <li
      v-if="commentsLength || lastOption === 'blogPost'"
      class="action-buttons-group__item"
    >
      <button
        type="button"
        @click="toggleChildComments"
        class="action-buttons-group__button"
        v-if="lastOption === 'replies'"
      >
        <span
          class="action-buttons-group__text-in-button"
          v-if="showChildComments"
          >Hide comments ({{ commentsLength }})</span
        >
        <span class="action-buttons-group__text-in-button" v-else
          >Show comments ({{ commentsLength }})</span
        >
      </button>
      <template v-else>
        <button
          class="action-buttons-group__button"
          @click="$emit('show-context')"
          v-if="blogPostExists"
        >
          <span class="action-buttons-group__text-in-button">
            Show context
          </span>
        </button>
        <button class="action-buttons-group__button" v-else>
          <span class="action-buttons-group__text-in-button">
            (Original blog post has been deleted)
          </span>
        </button>
      </template>
    </li>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
import IconLike from '~svg/icon-like.svg';
import CommentIcon from '~svg/comment-icon.svg';
import ReblogNormalIcon from '~svg/reblog-normal-icon.svg';
import DotsButton from '~common/Buttons/DotsButton';

export default {
  components: {
    IconLike,
    CommentIcon,
    ReblogNormalIcon,
    DotsButton
  },
  props: {
    options: {
      type: Array
    },
    engagementStats: {
      type: Object
    },
    commentsLength: {
      type: Number
    },
    showNewCommentForm: {
      type: Boolean
    },
    userLiked: {
      type: Boolean
    },
    showChildComments: {
      type: Boolean
    },
    userHasEditPermissions: {
      type: Boolean,
      default: false
    },
    isBlogPostAuthor: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isAddingUser: {
      type: Boolean,
      default: false
    },
    forBlogPost: {
      type: Boolean,
      default: false
    },
    lastOption: {
      type: String,
      default: 'replies'
    },
    blogPostExists: {
      type: [Boolean, Number],
      default: true
    }
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  data() {
    return {
      dropdownShow: false
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownShow = !this.dropdownShow;
    },
    /*@TODO revise click outside*/
    handleActionDropdownClose() {
      this.dropdownShow = false;
    },
    toggleCommentForm() {
      this.$emit('toggleCommentForm');
    },
    openBlogPostModal() {
      this.$emit('openBlogPostModal');
    },
    toggleChildComments() {
      this.$emit('toggleChildComments');
    },
    handleCommentButtonClick() {
      this.openBlogPostModal();
      if (this.isAuthenticated) {
        this.toggleCommentForm();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.action-buttons-group {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: var(--element-padding-m) var(--element-padding-l) 0;
  &.comment {
    padding: 0;
  }
  &__item {
    margin-right: var(--element-margin-l);
    display: flex;
    align-items: center;
    position: relative;
    padding-bottom: var(--element-padding-m);

    &:first-child,
    &:nth-child(2) {
      ::v-deep svg path:first-child {
        fill: var(--BG-blog-post);
      }
      ::v-deep svg path:last-child {
        fill: var(--text-primary);
      }
    }
  }

  &__button {
    background: transparent;
    margin-right: var(--element-margin-xs);
    color: var(--text-button-comments-show);
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold';
    display: flex;

    &:focus {
      outline: none;
      ::v-deep svg {
        fill: var(--BG-button-pagination-active);
      }
    }

    > ::v-deep svg {
      fill: var(--text-primary);
      width: 20px;
      height: 20px;
    }

    &.active {
      > ::v-deep svg {
        fill: var(--BG-button-pagination-active);
        path:first-child,
        path:last-child {
          fill: var(--BG-button-pagination-active);
        }
      }
    }
    &.disabled,
    &.disabled:hover {
      ::v-deep svg {
        fill: var(--text-create-account-inactive);
      }
      ::v-deep svg path:last-child {
        fill: var(--text-create-account-inactive);
      }

      ::v-deep svg path:first-child {
        fill: var(--text-create-account-inactive);
      }
    }
  }
  &__button:hover {
    ::v-deep svg,
    ::v-deep svg path:nth-child(2) {
      fill: var(--text-secondary);
    }
  }

  &__text-in-button {
    text-transform: uppercase;
  }
  &__value {
    color: var(--text-primary);
    font-size: var(--size-small);
    font-family: 'OpenSans-Bold';
  }
}
</style>
