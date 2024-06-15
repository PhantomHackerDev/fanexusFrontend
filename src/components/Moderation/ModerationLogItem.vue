<template>
  <tr class="moderation-log-item">
    <td class="moderation-log-item__cell">{{ alias.name }}</td>
    <td class="moderation-log-item__cell">{{ actionDisplay }}</td>
    <td class="moderation-log-item__cell">{{ reason }}</td>
    <td class="moderation-log-item__cell">
      <author-title
        class="moderation-log-item__author"
        @author-click="goToOrigin"
        :name="actionItem.Alias.name"
        :blog-alias-name="
          isShared && !actionItem.content ? actionItem.Alias.name : ''
        "
        :image="actionItem.Alias.avatar.src"
        :date="actionItem.updatedAt"
        :alt="actionItem.Alias.avatar.alt"
        :is-shared="isShared"
        :reblog-id="actionItem.reblogOfBlogPostId"
      />
      <expandable class="moderation-log-item__content">
        <div>
          <tags-list
            v-if="actionItem.Tags"
            :list="actionItem.Tags"
            @click.native.prevent
            @select="goToTag"
          />
        </div>
        <div
          v-html="
            isShared && !actionItem.content
              ? actionItem.reblogOfBlogPost.content
              : actionItem.content
          "
        />
      </expandable>
    </td>
    <td class="moderation-log-item__cell">{{ createdAt | dateFormat }}</td>
  </tr>
</template>

<script>
import AuthorTitle from '~common/AuthorTitle';
import TagsList from '~common/TagsList';
import tagListMixin from '@/mixins/tag-list.mixin';
import Expandable from '~common/Expandable';

export default {
  props: {
    alias: {
      type: Object,
      required: true
    },
    reason: {
      type: String,
      default: ''
    },
    details: {
      type: Object
    },
    createdAt: {
      type: String
    }
  },
  components: {
    AuthorTitle,
    TagsList,
    Expandable
  },
  mixins: [tagListMixin],
  methods: {
    goToOrigin() {
      const { link, id } = this.actionItem.Alias.Blog;

      const params = {
        name: link || id,
        id: link ? undefined : 'id'
      };

      this.$router.push({ name: 'blog', params });
    }
  },
  computed: {
    actionDisplay() {
      return this.details.blogPost ? 'Blog post deleted' : 'Comment deleted';
    },
    actionItem() {
      return this.details.blogPost || this.details.comment;
    },
    isShared() {
      return !!(
        this.details.BlogPost && this.details.BlogPost.reblogOfBlogPost
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.moderation-log-item {
  &__cell {
    padding: var(--element-padding-s);
  }

  &__author {
    cursor: pointer;
  }

  &__content {
    position: relative;
    padding: 0 var(--element-padding-m) var(--element-padding-m);
    word-wrap: break-word;
    overflow: auto;

    ::v-deep {
      @include user-content;
    }
  }
}
</style>
