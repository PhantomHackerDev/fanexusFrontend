<template>
  <div class="sidebar-tag-counts">
    <h3 class="sidebar-tag-counts__title">Blog post tags</h3>
    <tags-list :list="sortedTags" @select="addTag" />
    <template v-if="currentTags.length">
      <h4 class="sidebar-tag-counts__subtitle">Currently selected</h4>
      <tags-list
        :list="currentTagObjects"
        @select="goToTag"
        @remove-tag="removeTag"
      />
    </template>
  </div>
</template>

<script>
import { routerSecureNavigation } from '@/services/router.service';
import TagsList from '~common/TagsList';
import tagListMixin from '@/mixins/tag-list.mixin';

export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    currentTags: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TagsList
  },
  mixins: [tagListMixin],
  computed: {
    sortedTags() {
      return this.tags
        .filter(tag => !this.currentTags.includes(tag.name))
        .sort((tag1, tag2) => tag2.tagCount - tag1.tagCount);
    },
    currentTagObjects() {
      return this.tags
        .filter(tag => this.currentTags.includes(tag.name))
        .sort((tag1, tag2) => tag2.tagCount - tag1.tagCount);
    }
  },
  methods: {
    addTag(tagName) {
      const tagNameParam = this.$route.params.tagNames;
      const parsedTagNames = tagNameParam && JSON.parse(tagNameParam);
      this.$router.push({
        name:
          this.$route.name === 'tagged-blog-posts' ||
          (parsedTagNames && parsedTagNames.length)
            ? this.$route.name
            : `${this.$route.name}-by-tags`,
        params: {
          tagNames: JSON.stringify([...this.currentTags, tagName]),
          order: this.$route.params.order,
          page: 1
        }
      });
    },
    removeTag(removedTagId) {
      const currentTags = this.currentTags.slice();
      currentTags.splice(
        currentTags.findIndex(
          tagName =>
            tagName === this.tags.find(({ id }) => id === removedTagId).name
        ),
        1
      );
      routerSecureNavigation({
        ...(!currentTags.length && {
          name: this.$route.name.replace('-by-tags', '')
        }),
        params: {
          tagNames: JSON.stringify(currentTags),
          order: this.$route.params.order
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-tag-counts {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-l);
  color: var(--text-primary);
  font-size: var(--size-regular);
  &__title {
    text-align: center;
    font-size: var(--size-title);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-m);
  }
  &__subtitle {
    text-align: center;
    margin-bottom: var(--element-margin-xs);
  }
}
</style>
