<template>
  <article class="tag" :class="context" v-if="tagData">
    <div class="tag-view">
      <section class="tag__section">
        <h4 class="tag__header">
          <component :is="context === 'sidebar' ? 'div' : 'span'">
            {{ tagData.name }}
          </component>
          <template v-if="isAuthenticated">
            <form-button
              class="tag-follow-button"
              type="cancel"
              text="Unfollow"
              @click.native.stop="unsubscribeFromTag(tagData.id)"
              v-if="tagData.isSubscribe"
              :small="context === 'sidebar'"
            />
            <form-button
              v-else
              class="tag-follow-button"
              type="submit"
              text="Follow"
              @click.native.stop="subscribeToTag(tagData.id)"
              :small="context === 'sidebar'"
            />

            <form-button
              v-if="tagData.isBlocking"
              class="tag-follow-button"
              type="submit"
              text="Unblock"
              @click.native.stop="toggleBlockTag(tagData.id, false)"
              :small="context === 'sidebar'"
            />
            <form-button
              v-else
              class="tag-follow-button"
              type="submit"
              text="Block"
              @click.native.stop="toggleBlockTag(tagData.id)"
              :small="context === 'sidebar'"
            />
            <form-button
              class="tag-follow-button"
              type="button"
              text="Edit"
              @click.native.stop="goToEditTag(tagData.name)"
              :small="context === 'sidebar'"
              v-if="!tagData.isLocked || isTagWrangler || isSuperTagWrangler"
            />
          </template>
        </h4>
        <show-all-button
          v-if="context === 'standalone'"
          @click.native="goToTaggedBlogPosts(tagData.name)"
          :text="`Blog posts tagged ${tagData.name}`"
        />
      </section>
      <section class="tag__section" v-if="tagData.parentTags.length">
        <h4 class="tag__header">Parent Tags:</h4>
        <tags-list
          :list="tagData.parentTags"
          @click.native.stop
          @select="safeGoToTag"
        />
      </section>
      <section class="tag__section" v-if="tagData.childTags.length">
        <h4 class="tag__header">Child Tags:</h4>
        <tags-list
          :list="tagData.childTags"
          @click.native.stop
          @select="safeGoToTag"
        />
      </section>
      <section class="tag__section" v-if="tagData.synonyms.length">
        <h4 class="tag__header">Synonyms:</h4>
        <tags-list :list="tagData.synonyms" @click.native.stop />
      </section>
      <section class="tag__section" v-if="tagData.description">
        <h4 class="tag__header">Description</h4>
        <div class="tag-description">
          <expandable class="tag__description" content-label="description">
            <p
              class="tag__description-content"
              v-html="sanitize(tagData.description)"
            />
          </expandable>
        </div>
      </section>
      <section class="tag__section" v-if="descendantLoops.length">
        <descendant-loop-warning :descendant-loops="descendantLoops" />
      </section>
    </div>
  </article>
</template>

<script>
import FormButton from '~common/Buttons/FormButton';
import { mapState, mapActions } from 'vuex';
import ShowAllButton from '~common/Buttons/ShowAllButton';
import { getTag } from '@/services/tag.service';
import {
  createFollow,
  deleteFollow,
  followableTypes,
  createBlock,
  deleteBlock
} from '@/services/follow.service';
import sanitize from '@/utils/sanitizeHTML';
import Expandable from '~common/Expandable';

import TagsList from '~common/TagsList';
import tagListMixin from '@/mixins/tag-list.mixin';
import DescendantLoopWarning from '~common/DescendantLoopWarning';

export default {
  props: {
    name: {
      default: '',
      type: [Number, String]
    },
    context: {
      type: String,
      default: 'standalone'
    }
  },
  components: {
    TagsList,
    FormButton,
    ShowAllButton,
    Expandable,
    DescendantLoopWarning
  },
  data() {
    return {
      tagData: null,
      sanitize,
      descendantLoops: []
    };
  },
  mixins: [tagListMixin],
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      isAuthenticated: state => state.auth.isAuthenticated,
      isTagWrangler: state => state.auth.userData.tagWrangler,
      isSuperTagWrangler: state => state.auth.userData.superTagWrangler
    })
  },
  methods: {
    async subscribeToTag(id) {
      try {
        await createFollow(id, followableTypes.tag);
        this.addToStat({ stat: 'followingCount', change: 1 });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unsubscribeFromTag(id) {
      try {
        await deleteFollow(id, followableTypes.tag);
        this.addToStat({ stat: 'followingCount', change: -1 });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async toggleBlockTag(id, isCreateBlock = true) {
      const action = isCreateBlock ? createBlock : deleteBlock;

      try {
        await action(id, followableTypes.tag, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    goToTaggedBlogPosts(name) {
      this.$router.push({
        name: 'tagged-blog-posts',
        params: { tagNames: JSON.stringify([name]) }
      });
    },
    async getData() {
      const { tag, parentTags, childTags, loops } = await getTag(this.name);
      this.tagData = {
        ...tag,
        isSubscribe: tag.aliasFollowing,
        isBlocking: tag.aliasBlocking,
        synonyms: tag.synonyms.map(synonym => ({ name: synonym })),
        parentTags: parentTags.map(parentTag => ({ name: parentTag })),
        childTags: childTags.map(childTag => ({ name: childTag }))
      };
      this.descendantLoops = loops;
    },
    goToEditTag(tagName) {
      this.$router.push({ name: 'tag-edit', params: { name: tagName } });
    },
    ...mapActions(['addToStat'])
  },
  mounted() {
    return this.getData();
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.tag {
  overflow-y: auto;
  width: 100%;

  &.standalone {
    grid-area: content;
    padding: var(--element-padding-s);

    .tag-view {
      max-width: var(--width-large);
      min-height: 100%;
      margin: 0 auto;
      border: var(--border-width-default) solid var(--border-block);
    }
    .tag-follow-button {
      margin-left: var(--element-margin-m);
    }
  }
  &.sidebar {
    .tag-follow-button:not(:last-child) {
      margin-top: var(--element-margin-xs);
      margin-right: var(--element-margin-xs);
    }
  }

  &-view {
    padding: var(--element-padding-m);
    border-radius: var(--border-radius);
    background-color: var(--BG-blog-post);

    &:not(:first-child) {
      margin-top: var(--element-margin-s);
    }
  }

  &__section {
    color: var(--text-primary);

    &:not(:first-child) {
      margin-top: var(--element-margin-m);
      padding-top: var(--element-margin-m);
      border-top: var(--border-width-thin) solid var(--divider-in-popup);
    }
  }
  &__header {
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold', sans-serif;
    margin: calc(-1 * var(--element-padding-s));
    padding: var(--element-padding-s);
    margin-bottom: 0;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: auto;
  }
  &__description {
    position: relative;

    &-content {
      font-size: var(--size-regular);
      margin-bottom: 0;
      color: var(--text-primary);

      ::v-deep {
        @include user-content;
      }
    }
  }
}
</style>
