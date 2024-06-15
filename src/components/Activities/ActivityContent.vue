<template>
  <expandable class="activity-content" :content-label="contentType">
    <div
      class="activity-content__area"
      ref="activityContent"
      v-html="content"
    />
  </expandable>
</template>

<script>
import Expandable from '~common/Expandable';

export default {
  components: {
    Expandable
  },
  props: {
    content: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.activity-content {
  margin: var(--element-margin-m) 0;
  &:last-child {
    margin-bottom: 0;
  }
  border: var(--border-width-thin) solid var(--popular-blog-divider);
  padding: var(--element-padding-m);
  position: relative;
  overflow: auto;

  &__area {
    ::v-deep {
      @include user-content;
    }
  }
}
</style>
