<template>
  <!-- @TODO make it reusable for other pages  -->
  <div class="following-tags">
    <div class="following-tags__wrapper">
      <h3 class="following-tags__heading">{{ heading }}</h3>
      <slot />
    </div>
    <tags-list
      class="following-tags__tags-list"
      :list="followingTags"
      @select="goToTag"
      @remove-tag="$emit('remove-tag', $event)"
    />
  </div>
</template>
<script>
import TagsList from '../common/TagsList';
import tagListMixin from '@/mixins/tag-list.mixin';

export default {
  components: {
    TagsList
  },
  props: {
    text: {
      type: String
    },
    heading: {
      type: String
    },
    followingTags: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  mixins: [tagListMixin]
};
</script>

<style lang="scss" scoped>
.following-tags {
  &__wrapper {
    display: flex;
    justify-content: space-between;
  }
  &__heading {
    font-family: 'OpenSans-Bold', sans-serif;
    font-size: var(--size-title);
    color: var(--text-primary);
    margin: 0;
    margin-bottom: var(--element-margin-l);
  }
  &__tags-list {
    padding: 0;
    margin-bottom: var(--element-margin-m);
  }
}
</style>
