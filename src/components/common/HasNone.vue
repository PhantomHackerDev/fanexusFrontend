<template>
  <div class="content-list">
    <slot v-if="hasContent" />
    <div class="content-list__none" v-else>{{ noneMessage }}</div>
  </div>
</template>

<script>
export default {
  props: {
    hasContent: {
      type: [Boolean, Number],
      default: false
    },
    noneMessage: {
      type: String,
      default: 'None.'
    }
  }
};
</script>

<style lang="scss" scoped>
.content-list__none {
  color: var(--text-primary);
  text-align: center;
}
</style>
