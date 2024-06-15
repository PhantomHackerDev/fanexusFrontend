<template>
  <div class="descendant-loop-warning">
    <p class="descendant-loop-warning__note" v-if="descendantLoops.length">
      Warning: this tag has descendant loops, which is likely not intentional
      and makes all the tags equivalent. The loops are:
    </p>
    <p
      class="descendant-loop-warning__item"
      v-for="(descendantLoop, index) of descendantLoops"
      :key="index"
    >
      <tags-list
        :list="descendantLoop.map(name => ({ name }))"
        @select="safeGoToTag"
      />
    </p>
  </div>
</template>

<script>
import TagsList from '~common/TagsList';
import tagListMixin from '@/mixins/tag-list.mixin';

export default {
  props: {
    descendantLoops: {
      required: true,
      type: Array
    }
  },
  components: {
    TagsList
  },
  mixins: [tagListMixin]
};
</script>

<style lang="scss" scoped>
.descendant-loop-warning {
  &__note {
    font-size: var(--size-small);
    color: var(--error);
  }

  &__item {
    border: var(--border-width-thin) solid var(--popular-blog-divider);
    padding: var(--element-padding-m);
    padding-bottom: var(--element-padding-s);
  }
}
</style>
